import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { v4 as uuidv4 } from "uuid";

import { RealtimeAgent } from "@openai/agents/realtime";

import { useRealtimeSession } from "@/hooks/use-realtime-session";
import useAudioDownload from "@/hooks/use-audio-download";

import { Progress } from "@/components/ui/progress";
import Transcript from "@/components/transcript";
import { useTranscript } from "@/components/transcript-context";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

interface InterviewAgentProps {
	assistantId: Id<"assistants">;
}

export function InterviewAgent({ assistantId }: InterviewAgentProps) {
	const { addTranscriptMessage } = useTranscript();
	const [userText, setUserText] = useState("");
	const audioElementRef = useRef<HTMLAudioElement | null>(null);
	const hasAutoStartedRef = useRef(false);
	const hasSessionInitializedRef = useRef(false);

	const { data: assistant, isLoading } = useQuery(
		convexQuery(api.assistants.getAssistant, {
			id: assistantId,
		}),
	);

	const { data: agents = [], isLoading: agentsLoading } = useQuery(
		convexQuery(api.agents.getAgentsByAssistant, { assistantId }),
	);

	const [sessionStatus, setSessionStatus] = useState<
		"DISCONNECTED" | "CONNECTING" | "CONNECTED"
	>("DISCONNECTED");
	const [selectedAgentName, setSelectedAgentName] = useState<string>("");

	useEffect(() => {
		if (agents.length > 0 && !selectedAgentName) {
			const firstAgent = agents.find((a) => a.order === 1) || agents[0];
			setSelectedAgentName(firstAgent.name);
		}
	}, [agents, selectedAgentName]);

	const { connect, sendUserText, sendEvent } = useRealtimeSession({
		onConnectionChange: (status) => {
			setSessionStatus(status as "DISCONNECTED" | "CONNECTING" | "CONNECTED");
		},
		onAgentHandoff: (agentName: string) => {
			const actualAgentName = agentName.replace(/_/g, " ");
			setSelectedAgentName(actualAgentName);
		},
	});

	const { startRecording, stopRecording, downloadRecording } =
		useAudioDownload();

	// Create audio element for the SDK
	const sdkAudioElement = useMemo(() => {
		if (typeof window === "undefined") return undefined;
		const el = document.createElement("audio");
		el.autoplay = true;
		el.style.display = "none";
		document.body.appendChild(el);
		return el;
	}, []);

	useEffect(() => {
		if (sdkAudioElement && !audioElementRef.current) {
			audioElementRef.current = sdkAudioElement;
		}
	}, [sdkAudioElement]);

	const fetchEphemeralKey = useCallback(async (): Promise<string | null> => {
		try {
			const tokenResponse = await fetch("/api/session");
			const data = await tokenResponse.json();

			if (!data.client_secret?.value) {
				setSessionStatus("DISCONNECTED");
				return null;
			}

			return data.client_secret.value;
		} catch (error) {
			console.error(error);
			setSessionStatus("DISCONNECTED");
			return null;
		}
	}, []);

	const sendSimulatedUserMessage = useCallback(
		(text: string) => {
			const id = uuidv4().slice(0, 32);
			addTranscriptMessage(id, "user", text, true);

			sendEvent({
				type: "conversation.item.create",
				item: {
					id,
					type: "message",
					role: "user",
					content: [{ type: "input_text", text }],
				},
			});
			sendEvent({ type: "response.create" });
		},
		[addTranscriptMessage, sendEvent],
	);

	const connectToRealtime = useCallback(async () => {
		if (sessionStatus !== "DISCONNECTED" || !assistant) return;
		setSessionStatus("CONNECTING");

		try {
			const EPHEMERAL_KEY = await fetchEphemeralKey();
			if (!EPHEMERAL_KEY) return;

			// Sort agents by their order field to ensure proper priority
			const sortedAgents = [...agents].sort((a, b) => a.order - b.order);

			// Create agents from all available agents for this assistant
			const realtimeAgents = sortedAgents.map((agent) => {
				const sdkCompatibleName = agent.name.replace(/ /g, "_");
				return new RealtimeAgent({
					name: sdkCompatibleName,
					instructions: agent.instruction,
					voice: assistant.voice,
					tools: [],
					handoffs: [],
				});
			});

			// Set up handoffs between agents
			realtimeAgents.forEach((agent) => {
				const otherAgents = realtimeAgents.filter(
					(other) => other.name !== agent.name,
				);
				agent.handoffs = otherAgents;
			});

			// Ensure the selected agent (or first agent by order) becomes the root agent
			const selectedAgentSdkName = selectedAgentName.replace(/ /g, "_");
			const selectedAgentIndex = realtimeAgents.findIndex(
				(agent) => agent.name === selectedAgentSdkName,
			);
			if (selectedAgentIndex > 0) {
				const [selectedAgentConfig] = realtimeAgents.splice(
					selectedAgentIndex,
					1,
				);
				realtimeAgents.unshift(selectedAgentConfig);
			}

			// If no agents available, create a default agent
			if (realtimeAgents.length === 0) {
				const defaultAgentName = assistant.name.replace(/ /g, "_");
				const defaultAgent = new RealtimeAgent({
					name: defaultAgentName,
					instructions:
						"You are a helpful AI assistant conducting an interview.",
					voice: assistant.voice,
					tools: [],
					handoffs: [],
				});
				realtimeAgents.push(defaultAgent);
			}

			await connect({
				getEphemeralKey: async () => EPHEMERAL_KEY,
				initialAgents: realtimeAgents,
				audioElement: sdkAudioElement,
			});
		} catch (err) {
			console.error(err);
			setSessionStatus("DISCONNECTED");
		}
	}, [
		sessionStatus,
		assistant,
		fetchEphemeralKey,
		agents,
		connect,
		sdkAudioElement,
		selectedAgentName,
	]);

	const updateSession = useCallback(() => {
		if (!assistant) return;

		// Use server VAD for turn detection
		const turnDetection = {
			type: "server_vad",
			threshold: 0.9,
			prefix_padding_ms: 300,
			silence_duration_ms: 500,
			create_response: true,
		};

		sendEvent({
			type: "session.update",
			session: {
				turn_detection: turnDetection,
				voice: assistant.voice || "ash",
				speed: assistant.speed || 1.0,
			},
		});

		// Send an initial 'hi' message to trigger the agent to greet the user
		sendSimulatedUserMessage("hi");
	}, [sendEvent, assistant, sendSimulatedUserMessage]);

	const handleSendTextMessage = () => {
		if (userText.trim()) {
			sendUserText(userText);
			setUserText("");
		}
	};

	// Removed onToggleConnection as only transcript is shown

	// Auto-start the session when component mounts
	useEffect(() => {
		if (
			assistant &&
			!agentsLoading &&
			sessionStatus === "DISCONNECTED" &&
			!hasAutoStartedRef.current
		) {
			hasAutoStartedRef.current = true;
			connectToRealtime();
		}
	}, [assistant, agentsLoading, sessionStatus, connectToRealtime]);

	// Update session once when connected
	// biome-ignore lint/correctness/useExhaustiveDependencies: We intentionally omit updateSession to run this only once when connected.
	useEffect(() => {
		if (sessionStatus === "CONNECTED" && !hasSessionInitializedRef.current) {
			updateSession();
			hasSessionInitializedRef.current = true;
		}
	}, [sessionStatus]);

	// Handle audio recording lifecycle
	useEffect(() => {
		if (sessionStatus === "CONNECTED" && audioElementRef.current?.srcObject) {
			const remoteStream = audioElementRef.current.srcObject as MediaStream;
			startRecording(remoteStream);
		}

		return () => {
			stopRecording();
		};
	}, [sessionStatus, startRecording, stopRecording]);

	// Clean up audio element on unmount
	useEffect(() => {
		return () => {
			if (sdkAudioElement && document.body.contains(sdkAudioElement)) {
				document.body.removeChild(sdkAudioElement);
			}
		};
	}, [sdkAudioElement]);

	// Show connecting state
	if (sessionStatus === "CONNECTING") {
		return (
			<div className="flex min-h-screen bg-background items-center justify-center">
				<div className="text-center space-y-4">
					<div className="text-muted-foreground">Starting interview...</div>
					<div className="text-sm text-muted-foreground">
						Please ensure your microphone is enabled
					</div>
				</div>
			</div>
		);
	}

	// Only show the interface once connected
	if (sessionStatus !== "CONNECTED") {
		return null;
	}

	// Interview progress component using shadcn
	const InterviewProgress = () => {
		const sortedAgents = [...agents].sort((a, b) => a.order - b.order);
		const currentAgentIndex = sortedAgents.findIndex(
			(agent) => agent.name === selectedAgentName,
		);
		const progressPercentage =
			((currentAgentIndex + 1) / sortedAgents.length) * 100;

		return (
			<div className="w-full max-w-2xl mx-auto mb-8 space-y-2">
				<div className="flex items-center justify-between">
					<div className="text-xs text-muted-foreground">
						{selectedAgentName}
					</div>
					<div className="text-xs text-muted-foreground">
						{currentAgentIndex + 1} of {sortedAgents.length}
					</div>
				</div>

				<Progress value={progressPercentage} className="h-1" />
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Main Content */}
			<div className="flex flex-col items-center justify-center px-6 py-12">
				<div className="max-w-2xl w-full">
					<div className="space-y-8">
						{/* Interview Progress Stepper */}
						{agents.length > 0 && selectedAgentName && <InterviewProgress />}

						{/* Conversation Area */}
						<Transcript
							userText={userText}
							setUserText={setUserText}
							onSendMessage={handleSendTextMessage}
							canSend={sessionStatus === "CONNECTED"}
							downloadRecording={downloadRecording}
							showActions={false}
							showBreadcrumbs={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
