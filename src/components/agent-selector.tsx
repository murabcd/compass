import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgentConfig } from "@/lib/ai/types";

interface AgentSelectorProps {
  selectedAgentName: string;
  handleSelectedAgentChange: (value: string) => void;
  selectedAgentConfigSet: AgentConfig[] | null;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgentName,
  handleSelectedAgentChange,
  selectedAgentConfigSet,
}) => {
  if (!selectedAgentConfigSet || selectedAgentConfigSet.length === 0) {
    return <div className="text-sm text-muted-foreground">No agents available</div>;
  }

  return (
    <div className="relative inline-block w-full">
      <Select value={selectedAgentName} onValueChange={handleSelectedAgentChange}>
        <SelectTrigger className="w-full font-normal">
          <SelectValue placeholder="Select agent" />
        </SelectTrigger>
        <SelectContent>
          {selectedAgentConfigSet.map((agent) => (
            <SelectItem key={agent.name} value={agent.name}>
              <div className="flex flex-col">
                <span>{agent.name}</span>
                {agent.handoffDescription && (
                  <span className="text-xs text-muted-foreground">
                    {agent.handoffDescription}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgentSelector;
