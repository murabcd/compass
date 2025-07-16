import { useRouter } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import type React from "react";
import { useState } from "react";
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
import { modelRealtimeMini } from "@/lib/ai/models";

interface InterviewCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultAssistantId?: Id<"assistants">;
}

export function InterviewCreateDialog({
	open,
	onOpenChange,
	defaultAssistantId,
}: InterviewCreateDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const createAssistant = useMutation(api.assistants.createAssistant);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const assistantId = await createAssistant({
				name: name.trim(),
				description: description.trim(),
				model: modelRealtimeMini,
				temperature: 0.8,
				maxTokens: 512,
			});

			toast.success("Interview assistant created successfully!");
			onOpenChange(false);

			// Navigate to the assistant setup page
			router.navigate({
				to: "/assistants/$assistantId",
				params: { assistantId },
			});
		} catch (error: unknown) {
			console.error(error);
			toast.error("Failed to create interview assistant. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create new interview</DialogTitle>
					<DialogDescription>
						Create a new AI interview assistant with a name and description.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Interview name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Senior Developer Interview, Technical Screening"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe what this interview covers and what skills it evaluates..."
							rows={3}
							className="max-h-[350px]"
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
							{isSubmitting ? "Creating..." : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
