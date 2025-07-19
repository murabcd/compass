import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Bot, Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface AssistantSelectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelected?: (assistantId: Id<"assistants">) => void;
	currentAssistantId?: Id<"assistants"> | null;
}

export function AssistantSelectDialog({
	open,
	onOpenChange,
	onSelected,
	currentAssistantId,
}: AssistantSelectDialogProps) {
	const [selectedAssistant, setSelectedAssistant] =
		useState<Id<"assistants"> | null>(currentAssistantId || null);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	// Update selected assistant when currentAssistantId changes
	useEffect(() => {
		setSelectedAssistant(currentAssistantId || null);
	}, [currentAssistantId]);

	const assistants = useQuery(api.assistants.getAssistants);

	const handleSelect = () => {
		if (selectedAssistant && onSelected) {
			onSelected(selectedAssistant);
			onOpenChange(false);
		}
	};

	const handleAssistantSelect = (assistantId: Id<"assistants">) => {
		setSelectedAssistant(assistantId);
		setIsPopoverOpen(false);
	};

	const formatDate = (timestamp: number) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(new Date(timestamp));
	};

	const selectedAssistantData = assistants?.find(
		(assistant) => assistant._id === selectedAssistant,
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Choose existing assistant</DialogTitle>
					<DialogDescription>
						Select an existing assistant to use for this interview.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="flex flex-col gap-2">
						<label htmlFor="assistant-selector" className="text-sm font-medium">
							Assistant
						</label>
						<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									aria-expanded={isPopoverOpen}
									aria-label="Select an assistant"
									className="w-full justify-between font-normal"
									disabled={!assistants}
								>
									<div className="flex items-center min-w-0">
										<div className="flex-1 min-w-0">
											<span className="truncate block text-sm">
												{!assistants
													? "Loading assistants..."
													: selectedAssistantData?.name ||
														"Select an assistant"}
											</span>
										</div>
									</div>
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
								<Command>
									<CommandInput placeholder="Search assistants..." />
									<CommandList>
										<CommandEmpty>No assistants found.</CommandEmpty>
										{assistants && assistants.length > 0 && (
											<CommandGroup>
												{assistants.map((assistant) => (
													<CommandItem
														key={assistant._id}
														onSelect={() =>
															handleAssistantSelect(assistant._id)
														}
														className="flex items-center p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
													>
														<Bot className="h-4 w-4 mr-2" />
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2">
																<span className="text-sm truncate block">
																	{assistant.name}
																</span>
																<Badge
																	variant={
																		assistant.isActive ? "default" : "secondary"
																	}
																	className="text-xs"
																>
																	{assistant.isActive ? "Active" : "Inactive"}
																</Badge>
															</div>
														</div>
														{selectedAssistant === assistant._id && (
															<Check className="ml-1 h-4 w-4" />
														)}
													</CommandItem>
												))}
											</CommandGroup>
										)}
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					{selectedAssistantData && (
						<div className="p-4 bg-muted rounded-lg">
							<h4 className="font-medium mb-2">{selectedAssistantData.name}</h4>
							<p className="text-sm text-muted-foreground mb-3 break-words">
								{selectedAssistantData.description || "No description provided"}
							</p>
							<div className="flex items-center gap-4 text-xs text-muted-foreground">
								<span>Model: {selectedAssistantData.model}</span>
								<span>Voice: {selectedAssistantData.voice}</span>
								<span>
									Created: {formatDate(selectedAssistantData._creationTime)}
								</span>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						className="cursor-pointer"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSelect}
						disabled={!selectedAssistant}
						className="cursor-pointer"
					>
						Select
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
