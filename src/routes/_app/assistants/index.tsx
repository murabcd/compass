import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Plus, WandSparkles } from "lucide-react";
import { useState } from "react";
import {
	AssistantCard,
	AssistantCardSkeleton,
} from "@/components/assistant-card";
import { AssistantCreateDialog } from "@/components/assistant-create-dialog";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/assistants/")({
	component: Assistants,
});

interface Assistant {
	_id: Id<"assistants">;
	_creationTime: number;
	name: string;
	description: string;
	model: string;
	temperature: number;
	maxTokens: number;
	voice: string;
	speed: number;
	isActive: boolean;
}

function Assistants() {
	const navigate = useNavigate();
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(
		null,
	);

	const { data: assistants, isLoading } = useQuery(
		convexQuery(api.assistants.getAssistants, {}),
	);

	const handleCreateAssistant = () => {
		setIsCreateDialogOpen(true);
	};

	const handleEditAssistant = (assistant: Assistant) => {
		setEditingAssistant(assistant);
	};

	const handleAssistantCreated = (assistantId: Id<"assistants">) => {
		// Navigate to the newly created assistant
		navigate({ to: "/assistants/$assistantId", params: { assistantId } });
	};

	if (isLoading || assistants === undefined) {
		return (
			<div className="flex flex-1 flex-col">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<div className="px-4 lg:px-6">
							<div className="flex items-center justify-end">
								<Button
									onClick={handleCreateAssistant}
									className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
								>
									<Plus className="h-4 w-4" />
									Create assistant
								</Button>
							</div>
						</div>
						<div className="px-4 lg:px-6">
							<div className="flex flex-col gap-3">
								{Array.from({ length: 6 }).map((_, index) => (
									<AssistantCardSkeleton key={index} />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-1 flex-col">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<div className="px-4 lg:px-6">
							<div className="flex items-center justify-end">
								<Button
									onClick={handleCreateAssistant}
									className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
								>
									<Plus className="h-4 w-4" />
									Create assistant
								</Button>
							</div>
						</div>

						{assistants.length === 0 ? (
							<div className="px-4 lg:px-6">
								<EmptyState
									icon={WandSparkles}
									title="No assistants yet"
									description="Create your first AI assistant to help automate recruitment tasks and improve efficiency."
									actionLabel="Create first assistant"
									onAction={handleCreateAssistant}
								/>
							</div>
						) : (
							<div className="px-4 lg:px-6">
								<div className="flex flex-col gap-3">
									{assistants.map((assistant) => (
										<AssistantCard
											key={assistant._id}
											assistant={assistant}
											onEdit={() => handleEditAssistant(assistant)}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<AssistantCreateDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onCreated={handleAssistantCreated}
			/>

			<AssistantCreateDialog
				open={!!editingAssistant}
				onOpenChange={(open) => !open && setEditingAssistant(null)}
				assistant={editingAssistant || undefined}
			/>
		</>
	);
}
