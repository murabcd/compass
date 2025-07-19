import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AgentCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	assistantId: Id<"assistants">;
	agent?: {
		_id: Id<"agents">;
		name: string;
		instruction: string;
		handoffDescription?: string;
		order: number;
	};
}

export function AgentCreateDialog({
	open,
	onOpenChange,
	assistantId,
	agent,
}: AgentCreateDialogProps) {
	const [name, setName] = useState("");
	const [instruction, setInstruction] = useState("");
	const [handoffDescription, setHandoffDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const createAgent = useMutation(api.agents.createAgent);
	const updateAgent = useMutation(api.agents.updateAgent);

	const isEditing = !!agent;

	useEffect(() => {
		if (agent) {
			setName(agent.name);
			setInstruction(agent.instruction);
			setHandoffDescription(agent.handoffDescription || "");
		} else {
			// Reset form for new agent
			setName("");
			setInstruction("");
			setHandoffDescription("");
		}
	}, [agent]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (isEditing && agent) {
				await updateAgent({
					id: agent._id,
					name: name.trim(),
					instruction: instruction.trim(),
					handoffDescription: handoffDescription.trim() || undefined,
					order: agent.order,
				});
				toast.success("Agent updated successfully!");
			} else {
				await createAgent({
					assistantId,
					name: name.trim(),
					instruction: instruction.trim(),
					handoffDescription: handoffDescription.trim() || undefined,
				});
				toast.success("Agent created successfully!");
			}

			onOpenChange(false);
		} catch (error) {
			console.error("Error saving agent:", error);
			toast.error(
				`Failed to ${isEditing ? "update" : "create"} agent. Please try again.`,
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit agent" : "Create new agent"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the agent's configuration and instruction."
							: "Create a new agent with specific instruction and handoff capabilities."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Agent name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Initial Screener, Technical Interviewer"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="instruction">Instruction</Label>
						<Textarea
							id="instruction"
							value={instruction}
							onChange={(e) => setInstruction(e.target.value)}
							placeholder="Provide detailed instruction for this agent's role and behavior..."
							className="h-[350px] resize-none"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="handoffDescription">Handoff description</Label>
						<Input
							id="handoffDescription"
							value={handoffDescription}
							onChange={(e) => setHandoffDescription(e.target.value)}
							placeholder="Brief description for when other agents hand off to this one"
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
							className="cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="cursor-pointer"
							disabled={isSubmitting || !name.trim() || !instruction.trim()}
						>
							{isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
