import { convexQuery } from "@convex-dev/react-query";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { AssistantCreateDialog } from "@/components/assistant-create-dialog";
import { AssistantShareDialog } from "@/components/assistant-share-dialog";
import { EmptyState } from "@/components/empty-state";
import { TranscriptProvider } from "@/components/transcript-context";
import { Skeleton } from "@/components/ui/skeleton";
import VoiceAgent from "@/components/voice-agent";

export const Route = createFileRoute("/_app/assistants/$assistantId")({
	parseParams: (p) => ({ assistantId: p.assistantId as Id<"assistants"> }),
	component: AssistantChat,
});

function AssistantChat() {
	const { assistantId } = Route.useParams();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

	const {
		data: assistant,
		isLoading,
		error,
	} = useQuery(
		convexQuery(api.assistants.getAssistant, {
			id: assistantId as Id<"assistants">,
		}),
	);

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
				<EmptyState
					icon={WandSparkles}
					title="Assistant not found"
					description="The assistant you're looking for doesn't exist or has been deleted."
					actionLabel="Go to assistants"
					onAction={() => window.history.back()}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-[calc(100vh-var(--header-height)-2rem)] overflow-hidden">
			<div className="flex-1 overflow-hidden">
				<TranscriptProvider>
					<VoiceAgent
						assistantId={assistantId as Id<"assistants">}
						onShareInterview={() => setIsShareDialogOpen(true)}
					/>
				</TranscriptProvider>
			</div>

			<AssistantCreateDialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				assistant={assistant}
			/>

			<AssistantShareDialog
				open={isShareDialogOpen}
				onOpenChange={setIsShareDialogOpen}
				assistantId={assistantId as Id<"assistants">}
				assistantName={assistant.name}
			/>
		</div>
	);
}
