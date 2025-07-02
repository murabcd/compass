import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceSelectorProps {
  availableVoices: string[];
  selectedVoice: string;
  handleVoiceChange: (value: string) => void;
}

const voiceConfig = [
  { id: "alloy", name: "Alloy" },
  { id: "ash", name: "Ash" },
  { id: "ballad", name: "Ballad" },
  { id: "coral", name: "Coral" },
  { id: "echo", name: "Echo" },
  { id: "sage", name: "Sage" },
  { id: "shimmer", name: "Shimmer" },
  { id: "verse", name: "Verse" },
];

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  availableVoices,
  selectedVoice,
  handleVoiceChange,
}) => {
  const availableVoiceConfigs = voiceConfig
    .filter((v) => availableVoices.includes(v.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Select value={selectedVoice} onValueChange={handleVoiceChange}>
      <SelectTrigger id="voice-selector" className="w-full">
        <SelectValue placeholder="Select voice" />
      </SelectTrigger>
      <SelectContent>
        {availableVoiceConfigs.map((voice) => (
          <SelectItem key={voice.id} value={voice.id}>
            {voice.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VoiceSelector;
