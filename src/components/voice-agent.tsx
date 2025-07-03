"use client";
import React, { useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { v4 as uuidv4 } from "uuid";

import { RealtimeAgent } from "@openai/agents/realtime";

import { SessionStatus } from "@/lib/ai/types";

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
import { Id } from "convex/_generated/dataModel";

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
    convexQuery(api.assistants.getAssistant, { id: assistantId })
  );

  // Fetch agents for this assistant
  const { data: agents = [] } = useQuery(
    convexQuery(api.agents.getAgentsByAssistant, { assistantId })
  );

  // Convex optimistic updates for assistant
  const updateAssistant = useMutation(
    api.assistants.updateAssistant
  ).withOptimisticUpdate((localStore, args) => {
    // Update the assistant query optimistically
    const currentAssistant = localStore.getQuery(api.assistants.getAssistant, {
      id: args.id,
    });
    if (currentAssistant) {
      localStore.setQuery(
        api.assistants.getAssistant,
        { id: args.id },
        { ...currentAssistant, ...args }
      );
    }
  });

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED");
  const [isEventsPaneExpanded, setIsEventsPaneExpanded] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return localStorage.getItem("logsExpanded") === "true";
  });
  const [userText, setUserText] = useState<string>("");
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return localStorage.getItem("audioPlaybackEnabled") !== "false";
  });
  const [isAgentCreateDialogOpen, setIsAgentCreateDialogOpen] = useState(false);
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [editingAgent, setEditingAgent] = useState<any>(null);

  // Initialize the audio download hook
  const { startRecording, stopRecording, downloadRecording } = useAudioDownload();

  // Set default selected agent when agents load
  useEffect(() => {
    if (agents.length > 0 && !selectedAgentName) {
      setSelectedAgentName(agents[0].name);
    }
  }, [agents, selectedAgentName]);

  const selectedAgent = agents.find((agent) => agent.name === selectedAgentName);

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
    });

  const fetchEphemeralKey = async (): Promise<string | null> => {
    try {
      const tokenResponse = await fetch("/api/session");
      const data = await tokenResponse.json();

      if (!data.client_secret?.value) {
        console.error("No ephemeral key provided by the server");
        setSessionStatus("DISCONNECTED");
        return null;
      }

      return data.client_secret.value;
    } catch (error) {
      console.error("Failed to fetch ephemeral key:", error);
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

      // Use selected agent's instruction or fallback to default
      const agentInstruction =
        selectedAgent?.instruction || "You are a helpful AI assistant.";

      // Create agent using stored assistant configuration and selected agent instruction
      const agent = new RealtimeAgent({
        name: selectedAgent?.name || assistant.name,
        instructions: agentInstruction,
        voice: assistant.voice,
        tools: [],
        handoffs: [],
      });

      await connect({
        getEphemeralKey: async () => EPHEMERAL_KEY,
        initialAgents: [agent],
        audioElement: sdkAudioElement,
        extraContext: {
          addTranscriptBreadcrumb,
        },
      });

      addTranscriptBreadcrumb(`Agent: ${selectedAgent?.name || assistant.name}`, agent);
    } catch (err) {
      console.error("Error connecting to OpenAI:", err);
      setSessionStatus("DISCONNECTED");
    }
  };

  const disconnectFromRealtime = () => {
    disconnect();
    setSessionStatus("DISCONNECTED");
  };

  const sendSimulatedUserMessage = (text: string) => {
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
    } catch (err) {
      console.error("Failed to send message:", err);
    }

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
    setSelectedAgentName(agentName);
    // If connected, we might want to reconnect with the new agent
    if (sessionStatus === "CONNECTED") {
      disconnectFromRealtime();
    }
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
        updateSession();
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

  // Update session when connected
  useEffect(() => {
    if (sessionStatus === "CONNECTED") {
      updateSession(true);
    }
  }, [sessionStatus]);

  // Update session when assistant data changes
  useEffect(() => {
    if (sessionStatus === "CONNECTED" && assistant) {
      updateSession();
    }
  }, [assistant]);

  // Handle audio playback
  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaybackEnabled) {
        audioElementRef.current.muted = false;
        audioElementRef.current.play().catch((err) => {
          console.warn("Autoplay may be blocked by browser:", err);
        });
      } else {
        audioElementRef.current.muted = true;
        audioElementRef.current.pause();
      }
    }

    try {
      mute(!isAudioPlaybackEnabled);
    } catch (err) {
      console.warn("Failed to toggle SDK mute", err);
    }
  }, [isAudioPlaybackEnabled]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem("logsExpanded", isEventsPaneExpanded.toString());
  }, [isEventsPaneExpanded]);

  useEffect(() => {
    localStorage.setItem("audioPlaybackEnabled", isAudioPlaybackEnabled.toString());
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
          isEventsPaneExpanded={isEventsPaneExpanded}
          setIsEventsPaneExpanded={setIsEventsPaneExpanded}
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
