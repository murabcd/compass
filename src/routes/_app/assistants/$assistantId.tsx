import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { WandSparkles } from "lucide-react";

import VoiceAgent from "@/components/voice-agent";
import { Skeleton } from "@/components/ui/skeleton";
import { TranscriptProvider } from "@/components/transcript-context";
import { AssistantCreateDialog } from "@/components/assistant-create-dialog";

import { useMutation } from "convex/react";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute("/_app/assistants/$assistantId")({
	component: AssistantChat,
});

function AssistantChat() {
	const { assistantId } = Route.useParams();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const {
		data: assistant,
		isLoading,
		error,
	} = useQuery(
		convexQuery(api.assistants.getAssistant, {
			id: assistantId as Id<"assistants">,
		}),
	);

	const deleteAssistant = useMutation(api.assistants.deleteAssistant);

	if (isLoading) {
		return (
			<div className="flex h-full">
				<div className="flex-1 flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<Skeleton className="h-12 w-12 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !assistant) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<WandSparkles className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-4 text-lg font-semibold">Assistant not found</h3>
					<p className="text-muted-foreground">
						The assistant you're looking for doesn't exist or has been deleted.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-[calc(100vh-var(--header-height)-2rem)] overflow-hidden">
			<TranscriptProvider>
				<VoiceAgent assistantId={assistantId as Id<"assistants">} />
			</TranscriptProvider>

			<AssistantCreateDialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				assistant={assistant}
			/>
		</div>
	);
}
