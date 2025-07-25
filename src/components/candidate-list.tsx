import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
	Calendar,
	Eye,
	Forward,
	MapPin,
	MoreHorizontal,
	Star,
	Tag,
	Trash2,
	User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { JobSelectDialog } from "@/components/job-select-dialog";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Candidate {
	_id: Id<"candidates">;
	_creationTime: number;
	resumeScore: number;
	talent: {
		name: string;
		title: string;
		country: string;
		experience: number;
		salaryMonth: number;
		vettedSkills: string[];
		image?: string;
		initials: string;
		isVerified?: boolean;
	};
}

interface CandidateListProps {
	candidates: Candidate[] | undefined;
	currentJobId: Id<"jobs">;
}

export function CandidateList({
	candidates,
	currentJobId,
}: CandidateListProps) {
	const [candidateToDelete, setCandidateToDelete] =
		useState<Id<"candidates"> | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [candidateToMove, setCandidateToMove] =
		useState<Id<"candidates"> | null>(null);

	const deleteCandidate = useMutation(api.candidates.deleteCandidate);

	const formatDate = (timestamp: number) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(new Date(timestamp));
	};

	const formatExperience = (years: number) => {
		return `${years} year${years !== 1 ? "s" : ""}`;
	};

	const getResumeScoreColor = (score: number) => {
		if (score >= 80) return "text-green-600 bg-green-50";
		if (score >= 60) return "text-orange-600 bg-orange-50";
		return "text-red-600 bg-red-50";
	};

	const handleRemoveCandidate = (candidateId: Id<"candidates">) => {
		setCandidateToDelete(candidateId);
	};

	const handleMoveCandidate = (candidateId: Id<"candidates">) => {
		setCandidateToMove(candidateId);
	};

	const handleConfirmDelete = async () => {
		if (!candidateToDelete) return;

		setIsDeleting(true);
		try {
			await deleteCandidate({ id: candidateToDelete });
			toast.success("Candidate removed successfully!");
			setCandidateToDelete(null);
		} catch (error) {
			toast.error("Failed to remove candidate. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<Tabs defaultValue="candidates" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="candidates" className="flex items-center gap-2">
						Candidates
						<Badge variant="secondary" className="ml-1">
							{candidates?.length || 0}
						</Badge>
					</TabsTrigger>
					<TabsTrigger
						value="recommendations"
						className="flex items-center gap-2"
					>
						<Star className="h-4 w-4" />
						AI vetted candidates
						<Badge variant="secondary" className="ml-1">
							{candidates?.filter((candidate) => candidate.resumeScore >= 70)
								.length || 0}
						</Badge>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="candidates" className="mt-6">
					{candidates && candidates.length > 0 ? (
						<div className="space-y-3">
							{candidates.map((candidate) => (
								<CandidateCard
									key={candidate._id}
									candidate={candidate}
									onRemove={handleRemoveCandidate}
									onMove={handleMoveCandidate}
									formatDate={formatDate}
									formatExperience={formatExperience}
									getResumeScoreColor={getResumeScoreColor}
								/>
							))}
						</div>
					) : (
						<EmptyState
							icon={User}
							title="No candidates yet"
							description="Once candidates are submitted, they'll appear here."
							actionLabel="Add Candidate"
						/>
					)}
				</TabsContent>

				<TabsContent value="recommendations" className="mt-6">
					{candidates &&
					candidates.filter((candidate) => candidate.resumeScore >= 70).length >
						0 ? (
						<div className="space-y-3">
							{candidates
								.filter((candidate) => candidate.resumeScore >= 70)
								.map((candidate) => (
									<CandidateCard
										key={candidate._id}
										candidate={candidate}
										onRemove={handleRemoveCandidate}
										onMove={handleMoveCandidate}
										formatDate={formatDate}
										formatExperience={formatExperience}
										getResumeScoreColor={getResumeScoreColor}
										variant="recommendation"
									/>
								))}
						</div>
					) : (
						<EmptyState
							icon={Star}
							title="No recommended candidates"
							description="AI-vetted candidates will appear here."
							actionLabel="View All Candidates"
						/>
					)}
				</TabsContent>
			</Tabs>

			<AlertDialog
				open={!!candidateToDelete}
				onOpenChange={() => setCandidateToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							candidate and all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							disabled={isDeleting}
							className="bg-destructive hover:bg-destructive/90 cursor-pointer"
						>
							{isDeleting ? "Removing..." : "Remove"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<JobSelectDialog
				open={!!candidateToMove}
				onOpenChange={() => setCandidateToMove(null)}
				candidateId={candidateToMove!}
				currentJobId={currentJobId}
			/>
		</>
	);
}

interface CandidateCardProps {
	candidate: Candidate;
	onRemove: (candidateId: Id<"candidates">) => void;
	onMove: (candidateId: Id<"candidates">) => void;
	formatDate: (timestamp: number) => string;
	formatExperience: (years: number) => string;
	getResumeScoreColor: (score: number) => string;
	variant?: "default" | "recommendation";
}

function CandidateCard({
	candidate,
	onRemove,
	onMove,
	formatDate,
	formatExperience,
	getResumeScoreColor,
	variant = "default",
}: CandidateCardProps) {
	return (
		<div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card hover:shadow-sm transition-all cursor-pointer group">
			<div className="flex items-center gap-4 flex-1">
				<Avatar className="h-10 w-10">
					<AvatarImage src={candidate.talent.image} />
					<AvatarFallback>{candidate.talent.initials}</AvatarFallback>
				</Avatar>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-3 mb-3">
						<h3 className="font-medium truncate">{candidate.talent.name}</h3>
						{candidate.talent.isVerified && (
							<div
								className="h-2 w-2 rounded-full bg-blue-500"
								title="Verified"
							/>
						)}
					</div>

					{variant === "default" ? (
						<div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<User className="h-3 w-3" />
								<span>{candidate.talent.title}</span>
							</div>
							<div className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								<span>{candidate.talent.country}</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								<span>
									Exp: {formatExperience(candidate.talent.experience)}
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3" />
								<span>
									${candidate.talent.salaryMonth.toLocaleString()}
									/month
								</span>
							</div>
							{candidate.talent.vettedSkills.length > 0 && (
								<div className="flex items-center gap-1">
									<Tag className="h-3 w-3" />
									<span>
										{candidate.talent.vettedSkills.slice(0, 2).join(", ")}
										{candidate.talent.vettedSkills.length > 2 &&
											` +${candidate.talent.vettedSkills.length - 2}`}
									</span>
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<User className="h-3 w-3" />
								<span>{candidate.talent.title}</span>
							</div>
							<div className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								<span>{candidate.talent.country}</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								<span>
									Exp: {formatExperience(candidate.talent.experience)}
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3" />
								<span>
									${candidate.talent.salaryMonth.toLocaleString()}
									/month
								</span>
							</div>
							{candidate.talent.vettedSkills.length > 0 && (
								<div className="flex items-center gap-1">
									<Tag className="h-3 w-3" />
									<span>
										{candidate.talent.vettedSkills.slice(0, 2).join(", ")}
										{candidate.talent.vettedSkills.length > 2 &&
											` +${candidate.talent.vettedSkills.length - 2}`}
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="text-center">
					<div
						className={`px-2 py-1 rounded text-xs font-medium ${getResumeScoreColor(candidate.resumeScore)}`}
					>
						{candidate.resumeScore}%
					</div>
				</div>

				<div className="text-center">
					<div className="text-xs text-muted-foreground mb-1">Applied on</div>
					<div className="text-xs">{formatDate(candidate._creationTime)}</div>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
						>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Eye className="h-4 w-4" />
							View profile
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onMove(candidate._id)}>
							<Forward className="h-4 w-4" />
							Add to another job
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onRemove(candidate._id)}
							className="text-destructive"
						>
							<Trash2 className="h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
