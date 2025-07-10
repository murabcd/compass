import React, { useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { v4 as uuidv4 } from "uuid";

import { RealtimeAgent } from "@openai/agents/realtime";

import type { SessionStatus } from "@/lib/ai/types";

import useAudioDownload from "@/hooks/use-audio-download";
import { useRealtimeSession } from "@/hooks/use-realtime-session";

import { toast } from "sonner";

import Transcript from "@/components/transcript";
import RightSidebar from "@/components/right-sidebar";
import Messages from "@/components/messages";
import { useTranscript } from "@/components/transcript-context";
import { AgentCreateDialog } from "@/components/agent-create-dialog";

import { convexQuery } from "@convex-dev/react-query";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

const availableVoices = [
	"alloy",
	"ash",
	"ballad",
	"coral",
	"echo",
	"sage",
	"shimmer",
	"verse",
];

interface VoiceAgentProps {
	assistantId: Id<"assistants">;
	onSessionStatusChange?: (status: SessionStatus) => void;
}

function VoiceAgent({ assistantId, onSessionStatusChange }: VoiceAgentProps) {
	const { addTranscriptMessage, addTranscriptBreadcrumb } = useTranscript();

	// Fetch assistant configuration from database
	const { data: assistant, isLoading } = useQuery(
		convexQuery(api.assistants.getAssistant, { id: assistantId }),
	);

	// Fetch agents for this assistant
	const { data: agents = [] } = useQuery(
		convexQuery(api.agents.getAgentsByAssistant, { assistantId }),
	);

	// Convex optimistic updates for assistant
	const updateAssistant = useMutation(
		api.assistants.updateAssistant,
	).withOptimisticUpdate((localStore, args) => {
		// Update the assistant query optimistically
		const currentAssistant = localStore.getQuery(api.assistants.getAssistant, {
			id: args.id,
		});
		if (currentAssistant) {
			localStore.setQuery(
				api.assistants.getAssistant,
				{ id: args.id },
				{ ...currentAssistant, ...args },
			);
		}
	});

	const audioElementRef = useRef<HTMLAudioElement | null>(null);
	// Ref to identify whether the latest agent switch came from an automatic handoff
	const handoffTriggeredRef = useRef(false);
	const [sessionStatus, setSessionStatus] =
		useState<SessionStatus>("DISCONNECTED");
	const [isEventsPaneExpanded, setIsEventsPaneExpanded] = useState<boolean>(
		() => {
			if (typeof window === "undefined") {
				return false;
			}
			return localStorage.getItem("logsExpanded") === "true";
		},
	);
	const [userText, setUserText] = useState<string>("");
	const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState<boolean>(
		() => {
			if (typeof window === "undefined") {
				return true;
			}
			return localStorage.getItem("audioPlaybackEnabled") !== "false";
		},
	);
	const [isAgentCreateDialogOpen, setIsAgentCreateDialogOpen] = useState(false);
	const [selectedAgentName, setSelectedAgentName] = useState<string>("");
	const [editingAgent, setEditingAgent] = useState<any>(null);

	// Initialize the audio download hook
	const { startRecording, stopRecording, downloadRecording } =
		useAudioDownload();

	// Set default selected agent when agents load
	useEffect(() => {
		if (agents.length > 0 && !selectedAgentName) {
			setSelectedAgentName(agents[0].name);
		}
	}, [agents, selectedAgentName]);

	const selectedAgent = agents.find(
		(agent) => agent.name === selectedAgentName,
	);

	const sdkAudioElement = React.useMemo(() => {
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

	const { connect, disconnect, sendUserText, sendEvent, interrupt, mute } =
		useRealtimeSession({
			onConnectionChange: (s) => {
				const status = s as SessionStatus;
				setSessionStatus(status);
				onSessionStatusChange?.(status);
			},
			onAgentHandoff: (agentName: string) => {
				handoffTriggeredRef.current = true;
				// Convert underscores back to spaces to match database names
				const actualAgentName = agentName.replace(/_/g, " ");
				setSelectedAgentName(actualAgentName);
			},
		});

	const fetchEphemeralKey = async (): Promise<string | null> => {
		try {
			const tokenResponse = await fetch("/api/session");
			const data = await tokenResponse.json();

			if (!data.client_secret?.value) {
				setSessionStatus("DISCONNECTED");
				return null;
			}

			return data.client_secret.value;
		} catch (error) {
			setSessionStatus("DISCONNECTED");
			return null;
		}
	};

	const connectToRealtime = async () => {
		if (sessionStatus !== "DISCONNECTED" || !assistant) return;
		setSessionStatus("CONNECTING");

		try {
			const EPHEMERAL_KEY = await fetchEphemeralKey();
			if (!EPHEMERAL_KEY) return;

			// Create agents from all available agents for this assistant
			const realtimeAgents = agents.map((agent) => {
				// Convert spaces to underscores for SDK compatibility
				const sdkCompatibleName = agent.name.replace(/ /g, "_");
				return new RealtimeAgent({
					name: sdkCompatibleName,
					instructions: agent.instruction,
					voice: assistant.voice,
					tools: [],
					handoffs: [], // Will be populated after all agents are created
				});
			});

			// Set up handoffs between agents - each agent can hand off to all others
			realtimeAgents.forEach((agent) => {
				const otherAgents = realtimeAgents.filter(
					(other) => other.name !== agent.name,
				);
				agent.handoffs = otherAgents;
			});

			// Ensure the selectedAgent is first so that it becomes the root
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
					instructions: "You are a helpful AI assistant.",
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
				extraContext: {
					addTranscriptBreadcrumb,
				},
			});

			addTranscriptBreadcrumb(
				`Agent: ${selectedAgent?.name || assistant.name}`,
				realtimeAgents[0],
			);
		} catch (err) {
			setSessionStatus("DISCONNECTED");
		}
	};

	const disconnectFromRealtime = () => {
		disconnect();
		setSessionStatus("DISCONNECTED");
	};

	const sendClientEvent = (eventObj: any, eventNameSuffix = "") => {
		try {
			sendEvent(eventObj);
		} catch (err) {}
	};

	const sendSimulatedUserMessage = (text: string) => {
		const id = uuidv4().slice(0, 32);
		addTranscriptMessage(id, "user", text, true);

		sendClientEvent({
			type: "conversation.item.create",
			item: {
				id,
				type: "message",
				role: "user",
				content: [{ type: "input_text", text }],
			},
		});
		sendClientEvent(
			{ type: "response.create" },
			"(simulated user text message)",
		);
	};

	const updateSession = (shouldTriggerResponse: boolean = false) => {
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
				voice: assistant?.voice || "ash",
				speed: assistant?.speed || 1.0,
			},
		});

		// Send an initial 'hi' message to trigger the agent to greet the user
		if (shouldTriggerResponse) {
			sendSimulatedUserMessage("hi");
		}
	};

	const handleSendTextMessage = () => {
		if (!userText.trim()) return;
		interrupt();

		try {
			sendUserText(userText.trim());
		} catch (err) {}

		setUserText("");
	};

	const onToggleConnection = () => {
		if (sessionStatus === "CONNECTED" || sessionStatus === "CONNECTING") {
			disconnectFromRealtime();
		} else {
			connectToRealtime();
		}
	};

	const handleCreateAgent = () => {
		setEditingAgent(null);
		setIsAgentCreateDialogOpen(true);
	};

	const handleEditAgent = (agent: any) => {
		setEditingAgent(agent);
		setIsAgentCreateDialogOpen(true);
	};

	const handleAgentSelect = (agentName: string) => {
		// Reconnect session with the newly selected agent as root so that tool
		// execution works correctly.
		if (sessionStatus === "CONNECTED") {
			disconnectFromRealtime();
		}
		setSelectedAgentName(agentName);
		// connectToRealtime will be triggered by effect watching selectedAgentName
	};

	const handleDialogClose = () => {
		setIsAgentCreateDialogOpen(false);
		setEditingAgent(null);
	};

	const handleVoiceChange = async (newVoice: string) => {
		if (!assistant) return;

		try {
			await updateAssistant({
				id: assistant._id,
				name: assistant.name,
				description: assistant.description,
				model: assistant.model,
				temperature: assistant.temperature,
				maxTokens: assistant.maxTokens,
				voice: newVoice,
				speed: assistant.speed,
				isActive: assistant.isActive,
			});

			// If connected, update the session with new voice
			if (sessionStatus === "CONNECTED") {
				updateSession(false);
			}
		} catch (error) {
			toast.error("Failed to update voice. Please try again.");
		}
	};

	const handleSpeedChange = (newSpeed: number) => {
		if (!assistant) return;

		// Immediately update the session for real-time audio feedback
		if (sessionStatus === "CONNECTED") {
			sendEvent({
				type: "session.update",
				session: {
					turn_detection: {
						type: "server_vad",
						threshold: 0.9,
						prefix_padding_ms: 300,
						silence_duration_ms: 500,
						create_response: true,
					},
					voice: assistant.voice || "ash",
					speed: newSpeed,
				},
			});
		}

		// Use Convex optimistic updates for UI and database
		updateAssistant({
			id: assistant._id,
			name: assistant.name,
			description: assistant.description,
			model: assistant.model,
			temperature: assistant.temperature,
			maxTokens: assistant.maxTokens,
			voice: assistant.voice,
			speed: newSpeed,
			isActive: assistant.isActive,
		}).catch(() => {
			toast.error("Failed to update speed. Please try again.");
		});
	};

	const handleModelChange = async (newModel: string) => {
		if (!assistant) return;

		try {
			await updateAssistant({
				id: assistant._id,
				name: assistant.name,
				description: assistant.description,
				model: newModel,
				temperature: assistant.temperature,
				maxTokens: assistant.maxTokens,
				voice: assistant.voice,
				speed: assistant.speed,
				isActive: assistant.isActive,
			});
		} catch (error) {
			toast.error("Failed to update model. Please try again.");
		}
	};

	const handleTemperatureChange = (newTemperature: number) => {
		if (!assistant) return;

		// Use Convex optimistic updates for UI and database
		updateAssistant({
			id: assistant._id,
			name: assistant.name,
			description: assistant.description,
			model: assistant.model,
			temperature: newTemperature,
			maxTokens: assistant.maxTokens,
			voice: assistant.voice,
			speed: assistant.speed,
			isActive: assistant.isActive,
		}).catch(() => {
			toast.error("Failed to update temperature. Please try again.");
		});
	};

	const handleMaxTokensChange = (newMaxTokens: number) => {
		if (!assistant) return;

		// Use Convex optimistic updates for UI and database
		updateAssistant({
			id: assistant._id,
			name: assistant.name,
			description: assistant.description,
			model: assistant.model,
			temperature: assistant.temperature,
			maxTokens: newMaxTokens,
			voice: assistant.voice,
			speed: assistant.speed,
			isActive: assistant.isActive,
		}).catch(() => {
			toast.error("Failed to update max tokens. Please try again.");
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: addTranscriptBreadcrumb and updateSession change on every render and would cause infinite loops
	useEffect(() => {
		if (sessionStatus === "CONNECTED" && agents && selectedAgentName) {
			const currentAgent = agents.find((a) => a.name === selectedAgentName);
			if (currentAgent) {
				addTranscriptBreadcrumb(`Agent: ${selectedAgentName}`, currentAgent);
			}

			// Update session with handoff logic
			const isHandoff = handoffTriggeredRef.current;
			updateSession(!isHandoff);
			// Reset flag after handling so subsequent effects behave normally
			handoffTriggeredRef.current = false;
		}
	}, [sessionStatus, selectedAgentName, agents]);

	// Update session when assistant voice or speed changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: updateSession changes on every render and would cause infinite loops
	useEffect(() => {
		if (sessionStatus === "CONNECTED" && assistant) {
			updateSession(false);
		}
	}, [assistant?.voice, assistant?.speed, sessionStatus]);

	// Handle audio playback
	useEffect(() => {
		if (audioElementRef.current) {
			if (isAudioPlaybackEnabled) {
				audioElementRef.current.muted = false;
				audioElementRef.current.play().catch((err) => {});
			} else {
				audioElementRef.current.muted = true;
				audioElementRef.current.pause();
			}
		}

		try {
			mute(!isAudioPlaybackEnabled);
		} catch (err) {}
	}, [isAudioPlaybackEnabled, mute]);

	// Persist settings to localStorage
	useEffect(() => {
		localStorage.setItem("logsExpanded", isEventsPaneExpanded.toString());
	}, [isEventsPaneExpanded]);

	useEffect(() => {
		localStorage.setItem(
			"audioPlaybackEnabled",
			isAudioPlaybackEnabled.toString(),
		);
	}, [isAudioPlaybackEnabled]);

	// Handle audio recording lifecycle
	useEffect(() => {
		if (sessionStatus === "CONNECTED" && audioElementRef.current?.srcObject) {
			// The remote audio stream from the audio element
			const remoteStream = audioElementRef.current.srcObject as MediaStream;
			startRecording(remoteStream);
		}

		// Clean up on unmount or when sessionStatus changes
		return () => {
			stopRecording();
		};
	}, [sessionStatus, startRecording, stopRecording]);

	// Don't render until assistant data is loaded
	if (isLoading || !assistant) {
		return (
			<div className="flex h-full bg-background rounded-lg items-center justify-center">
				<div className="text-muted-foreground">Loading assistant...</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex h-full bg-background rounded-lg">
				{/* Main Voice Area */}
				<div className="flex-1 flex flex-col min-w-0">
					{/* Voice Interface */}
					<Transcript
						userText={userText}
						setUserText={setUserText}
						onSendMessage={handleSendTextMessage}
						canSend={sessionStatus === "CONNECTED"}
						downloadRecording={downloadRecording}
					/>

					{/* Voice Controls */}
					<Messages
						userText={userText}
						setUserText={setUserText}
						onSendMessage={handleSendTextMessage}
						canSend={sessionStatus === "CONNECTED"}
						sessionStatus={sessionStatus}
						onToggleConnection={onToggleConnection}
					/>
				</div>

				{/* Right Sidebar */}
				<RightSidebar
					sessionStatus={sessionStatus}
					isAudioPlaybackEnabled={isAudioPlaybackEnabled}
					setIsAudioPlaybackEnabled={setIsAudioPlaybackEnabled}
					selectedAgentName={selectedAgentName}
					onAgentSelect={handleAgentSelect}
					availableVoices={availableVoices}
					selectedVoice={assistant.voice}
					handleVoiceChange={handleVoiceChange}
					selectedSpeed={assistant.speed}
					handleSpeedChange={handleSpeedChange}
					selectedModel={assistant.model}
					handleModelChange={handleModelChange}
					selectedTemperature={assistant.temperature}
					handleTemperatureChange={handleTemperatureChange}
					selectedMaxTokens={assistant.maxTokens}
					handleMaxTokensChange={handleMaxTokensChange}
					assistantId={assistantId}
					onCreateAgent={handleCreateAgent}
					onEditAgent={handleEditAgent}
				/>
			</div>

			{/* Agent Creation/Edit Dialog */}
			<AgentCreateDialog
				open={isAgentCreateDialogOpen}
				onOpenChange={handleDialogClose}
				assistantId={assistantId}
				agent={editingAgent}
			/>
		</>
	);
}

export default VoiceAgent;
