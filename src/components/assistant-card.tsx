import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
	AudioLines,
	Cpu,
	Edit,
	MoreHorizontal,
	Power,
	PowerOff,
	Share2,
	Thermometer,
	Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AssistantShareDialog } from "@/components/assistant-share-dialog";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface AssistantCardProps {
	assistant: {
		_id: Id<"assistants">;
		name: string;
		description: string;
		model: string;
		temperature: number;
		voice: string;
		speed: number;
		isActive: boolean;
		_creationTime: number;
	};
	onEdit?: () => void;
}

export function AssistantCard({ assistant, onEdit }: AssistantCardProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isToggling, setIsToggling] = useState(false);

	const deleteAssistant = useMutation(api.assistants.deleteAssistant);
	const toggleStatus = useMutation(api.assistants.toggleAssistantStatus);

	const handleDropdownClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onEdit?.();
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowDeleteDialog(true);
	};

	const handleShareClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowShareDialog(true);
	};

	const handleToggleStatus = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsToggling(true);
		try {
			await toggleStatus({ id: assistant._id });
			toast.success(
				`Assistant ${assistant.isActive ? "deactivated" : "activated"} successfully!`,
			);
		} catch (error) {
			toast.error("Failed to update assistant status. Please try again.");
		} finally {
			setIsToggling(false);
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteAssistant({ id: assistant._id });
			toast.success("Assistant deleted successfully!");
			setShowDeleteDialog(false);
		} catch (error) {
			toast.error("Failed to delete assistant. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="relative">
				<Link
					to="/assistants/$assistantId"
					params={{ assistantId: assistant._id }}
				>
					<div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card hover:shadow-sm transition-all cursor-pointer group">
						<div className="flex-1 min-w-0 space-y-3">
							{/* Header */}
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<h3 className="text-base font-semibold truncate">
										{assistant.name}
									</h3>
									{!assistant.isActive && (
										<Badge variant="destructive" className="text-xs">
											Inactive
										</Badge>
									)}
								</div>
							</div>

							{/* Main content */}
							<div className="flex flex-wrap items-center gap-2">
								{/* Assistant details */}
								<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
									<div className="flex items-center gap-1">
										<Cpu className="h-3 w-3" />
										<span>{assistant.model}</span>
									</div>
									<div className="flex items-center gap-1">
										<Thermometer className="h-3 w-3" />
										<span>{assistant.temperature}</span>
									</div>
									<div className="flex items-center gap-1">
										<AudioLines className="h-3 w-3" />
										<span>{assistant.voice}</span>
									</div>
								</div>

								{/* Description */}
								<p className="text-sm text-muted-foreground line-clamp-1 flex-1 min-w-0">
									{assistant.description}
								</p>
							</div>
						</div>

						{/* Actions */}
						<div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
							<DropdownMenu>
								<DropdownMenuTrigger asChild onClick={handleDropdownClick}>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 hover:bg-muted cursor-pointer"
									>
										<MoreHorizontal className="h-4 w-4" />
										<span className="sr-only">Open menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" onClick={handleDropdownClick}>
									<DropdownMenuItem onClick={handleEdit}>
										<Edit className="	h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleShareClick}>
										<Share2 className="h-4 w-4" />
										Share
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleToggleStatus}
										disabled={isToggling}
									>
										{assistant.isActive ? (
											<>
												<PowerOff className="h-4 w-4" />
												Deactivate
											</>
										) : (
											<>
												<Power className="h-4 w-4" />
												Activate
											</>
										)}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleDeleteClick}
										className="text-destructive"
									>
										<Trash2 className="h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</Link>
			</div>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							assistant and all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-destructive hover:bg-destructive/90 cursor-pointer"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AssistantShareDialog
				open={showShareDialog}
				onOpenChange={setShowShareDialog}
				assistantId={assistant._id}
				assistantName={assistant.name}
			/>
		</>
	);
}

export function AssistantCardSkeleton() {
	return (
		<div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card">
			<div className="flex-1 min-w-0 space-y-3">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-4 rounded" />
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-5 w-16 rounded-full" />
					</div>
				</div>

				{/* Main content */}
				<div className="flex flex-wrap items-center gap-2">
					{/* Assistant details */}
					<div className="flex flex-wrap items-center gap-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-20" />
					</div>

					{/* Description */}
					<Skeleton className="h-4 w-64" />
				</div>
			</div>

			{/* Actions */}
			<div className="ml-4">
				<Skeleton className="h-8 w-8 rounded" />
			</div>
		</div>
	);
}

export default AssistantCard;
