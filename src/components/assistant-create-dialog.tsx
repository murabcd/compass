import type React from "react";
import { useState, useEffect } from "react";

import { toast } from "sonner";

import { modelRealtimeMini } from "@/lib/ai/models";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

interface AssistantCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated?: (assistantId: Id<"assistants">) => void;
	assistant?: {
		_id: Id<"assistants">;
		name: string;
		description: string;
		model: string;
		temperature: number;
		maxTokens: number;
		voice: string;
		speed: number;
		isActive: boolean;
	};
}

export function AssistantCreateDialog({
	open,
	onOpenChange,
	onCreated,
	assistant,
}: AssistantCreateDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const createAssistant = useMutation(api.assistants.createAssistant);
	const updateAssistant = useMutation(api.assistants.updateAssistant);

	const isEditing = !!assistant;

	useEffect(() => {
		if (assistant) {
			setName(assistant.name);
			setDescription(assistant.description);
		} else {
			setName("");
			setDescription("");
		}
	}, [assistant]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (isEditing && assistant) {
				await updateAssistant({
					id: assistant._id,
					name: name.trim(),
					description: description.trim(),
					model: assistant.model,
					temperature: assistant.temperature,
					maxTokens: assistant.maxTokens,
					voice: assistant.voice,
					speed: assistant.speed,
					isActive: assistant.isActive,
				});
				toast.success("Assistant updated successfully!");
			} else {
				const assistantId = await createAssistant({
					name: name.trim(),
					description: description.trim(),
					model: modelRealtimeMini,
					temperature: 0.8,
					maxTokens: 512,
				});
				toast.success("Assistant created successfully!");

				// Call the onCreated callback with the new assistant ID
				if (onCreated) {
					onCreated(assistantId);
				}
			}

			onOpenChange(false);
		} catch (error: unknown) {
			console.error(error);
			toast.error(
				`Failed to ${isEditing ? "update" : "create"} assistant. Please try again.`,
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
						{isEditing ? "Edit assistant" : "Create new assistant"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update your assistant information."
							: "Create a new assistant with a name and description."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Assistant name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Interview assistant, Screening assistant"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe what this assistant does and how it helps users..."
							rows={3}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting || !name.trim()}>
							{isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
