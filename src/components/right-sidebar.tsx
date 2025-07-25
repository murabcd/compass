import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Check, ChevronsUpDown, Pencil, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import VoiceSelector from "@/components/voice-selector";
import { modelInfoList } from "@/lib/ai/models";
import type { SessionStatus } from "@/lib/ai/types";

interface RightSidebarProps {
	sessionStatus: SessionStatus;
	isAudioPlaybackEnabled: boolean;
	setIsAudioPlaybackEnabled: (val: boolean) => void;
	selectedAgentName: string;
	onAgentSelect?: (agentName: string) => void;
	availableVoices: string[];
	selectedVoice: string;
	handleVoiceChange: (value: string) => void;
	selectedSpeed: number;
	handleSpeedChange: (value: number) => void;
	selectedModel: string;
	handleModelChange: (value: string) => void;
	selectedTemperature: number;
	handleTemperatureChange: (value: number) => void;
	selectedMaxTokens: number;
	handleMaxTokensChange: (value: number) => void;
	assistantId?: Id<"assistants">;
	onCreateAgent?: () => void;
	onEditAgent?: (agent: any) => void;
}

interface AgentItemProps {
	id: string;
	name: string;
	onSelect: () => void;
	onEdit: (e: React.MouseEvent) => void;
	onDelete: (e: React.MouseEvent) => void;
	isSelected: boolean;
}

const AgentItem = ({
	id,
	name,
	onSelect,
	onEdit,
	onDelete,
	isSelected,
}: AgentItemProps) => {
	return (
		<CommandItem
			onSelect={onSelect}
			className="flex items-center p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
		>
			<div className="flex-1 min-w-0">
				<span className="text-sm truncate block">{name}</span>
			</div>
			<div className="flex items-center gap-1 ml-2">
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0 hover:bg-accent-foreground/10"
					onClick={onEdit}
				>
					<Pencil className="h-3 w-3" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
					onClick={onDelete}
				>
					<Trash2 className="h-3 w-3" />
				</Button>
				{isSelected && <Check className="ml-1 h-4 w-4" />}
			</div>
		</CommandItem>
	);
};

const RightSidebar: React.FC<RightSidebarProps> = ({
	sessionStatus,
	isAudioPlaybackEnabled,
	setIsAudioPlaybackEnabled,
	selectedAgentName,
	onAgentSelect,
	availableVoices,
	selectedVoice,
	handleVoiceChange,
	selectedSpeed,
	handleSpeedChange,
	selectedModel,
	handleModelChange,
	selectedTemperature,
	handleTemperatureChange,
	selectedMaxTokens,
	handleMaxTokensChange,
	assistantId,
	onCreateAgent,
	onEditAgent,
}) => {
	const isConnected = sessionStatus === "CONNECTED";
	const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [agentToDelete, setAgentToDelete] = useState<any>(null);

	// Fetch agents for this assistant from database
	const { data: agents = [], isLoading: isLoadingAgents } = useQuery({
		...convexQuery(api.agents.getAgentsByAssistant, {
			assistantId: assistantId || ("" as Id<"assistants">),
		}),
		enabled: !!assistantId,
	});

	const deleteAgent = useMutation(api.agents.deleteAgent);

	const selectedAgent =
		agents.find((agent) => agent.name === selectedAgentName) || agents[0];

	const handleCreateAgent = () => {
		setIsAgentDropdownOpen(false);
		onCreateAgent?.();
	};

	const handleAgentSelect = (agentName: string) => {
		setIsAgentDropdownOpen(false);
		onAgentSelect?.(agentName);
	};

	const handleEditAgent = (e: React.MouseEvent, agent: any) => {
		e.stopPropagation();
		setIsAgentDropdownOpen(false);
		onEditAgent?.(agent);
	};

	const handleDeleteAgent = (e: React.MouseEvent, agent: any) => {
		e.stopPropagation();
		setAgentToDelete(agent);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteAgent = async () => {
		if (!agentToDelete) return;

		try {
			await deleteAgent({ id: agentToDelete._id });
			toast.success(`Agent "${agentToDelete.name}" deleted successfully!`);

			if (selectedAgentName === agentToDelete.name && agents.length > 1) {
				const remainingAgents = agents.filter(
					(a) => a._id !== agentToDelete._id,
				);
				if (remainingAgents.length > 0) {
					onAgentSelect?.(remainingAgents[0].name);
				}
			}
		} catch (error) {
			toast.error("Failed to delete agent. Please try again.");
		} finally {
			setIsDeleteDialogOpen(false);
			setAgentToDelete(null);
		}
	};

	const cancelDeleteAgent = () => {
		setIsDeleteDialogOpen(false);
		setAgentToDelete(null);
	};

	return (
		<>
			<div className="hidden md:flex md:w-64 px-4 pt-6 flex-col gap-y-6 rounded-br-lg border-l">
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="voice-selector">Voice</Label>
					<VoiceSelector
						availableVoices={availableVoices}
						selectedVoice={selectedVoice}
						handleVoiceChange={handleVoiceChange}
					/>
				</div>

				<div className="flex flex-col gap-y-2">
					<div className="flex justify-between items-center">
						<Label htmlFor="speed-slider">Speed</Label>
						<span className="text-xs text-muted-foreground">
							{selectedSpeed.toFixed(1)}x
						</span>
					</div>
					<Slider
						id="speed-slider"
						min={0.25}
						max={1.5}
						step={0.25}
						value={[selectedSpeed]}
						onValueChange={(value) => handleSpeedChange(value[0])}
						className="w-full"
					/>
				</div>

				<div className="flex flex-col gap-y-2">
					<div className="flex justify-between items-center">
						<Label htmlFor="temperature-slider">Temperature</Label>
						<span className="text-xs text-muted-foreground">
							{selectedTemperature.toFixed(2)}
						</span>
					</div>
					<Slider
						id="temperature-slider"
						min={0}
						max={1}
						step={0.01}
						value={[selectedTemperature]}
						onValueChange={(value) => handleTemperatureChange(value[0])}
						className="w-full"
					/>
				</div>

				<div className="flex flex-col gap-y-2">
					<div className="flex justify-between items-center">
						<Label htmlFor="max-tokens-slider">Max Tokens</Label>
						<span className="text-xs text-muted-foreground">
							{selectedMaxTokens}
						</span>
					</div>
					<Slider
						id="max-tokens-slider"
						min={1}
						max={4096}
						step={1}
						value={[selectedMaxTokens]}
						onValueChange={(value) => handleMaxTokensChange(value[0])}
						className="w-full"
					/>
				</div>

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="agent-selector">Agent</Label>

					<Popover
						open={isAgentDropdownOpen}
						onOpenChange={setIsAgentDropdownOpen}
					>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								aria-expanded={isAgentDropdownOpen}
								aria-label="Select an agent"
								className="w-full justify-between font-normal"
								disabled={isLoadingAgents}
							>
								<div className="flex items-center min-w-0">
									<div className="flex-1 min-w-0">
										<span className="truncate block text-sm">
											{isLoadingAgents
												? "Loading agents..."
												: selectedAgent?.name || "No agents yet"}
										</span>
									</div>
								</div>
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
							<Command>
								<CommandInput placeholder="Search agents..." />
								<CommandList>
									<CommandEmpty>No agents found.</CommandEmpty>
									{agents.length > 0 && (
										<CommandGroup>
											{agents.map((agent) => (
												<AgentItem
													key={agent._id}
													id={agent._id}
													name={agent.name}
													isSelected={selectedAgent?._id === agent._id}
													onSelect={() => handleAgentSelect(agent.name)}
													onEdit={(e) => handleEditAgent(e, agent)}
													onDelete={(e) => handleDeleteAgent(e, agent)}
												/>
											))}
										</CommandGroup>
									)}
								</CommandList>
								<CommandSeparator />
								<CommandList>
									<CommandGroup>
										<CommandItem
											onSelect={handleCreateAgent}
											className="flex items-center p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
										>
											<span className="text-sm">Create new agent</span>
										</CommandItem>
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="model-selector">Model</Label>
					<Select value={selectedModel} onValueChange={handleModelChange}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a model" />
						</SelectTrigger>
						<SelectContent>
							{modelInfoList.map((model) => (
								<SelectItem key={model.id} value={model.id}>
									{model.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center justify-between">
					<Label
						htmlFor="audio-playback-sidebar"
						className="flex items-center cursor-pointer text-sm pr-2"
					>
						Audio playback
					</Label>
					<Switch
						id="audio-playback-sidebar"
						checked={isAudioPlaybackEnabled}
						onCheckedChange={setIsAudioPlaybackEnabled}
						disabled={!isConnected}
					/>
				</div>
			</div>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={cancelDeleteAgent}
							className="cursor-pointer"
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDeleteAgent}
							className="bg-destructive hover:bg-destructive/90 cursor-pointer"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default RightSidebar;
