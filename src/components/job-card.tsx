import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
	Briefcase,
	DollarSign,
	Edit,
	MapPin,
	MoreHorizontal,
	Power,
	PowerOff,
	Tag,
	Trash2,
	TrendingUp,
	Users,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface JobCardProps {
	job: {
		_id: Id<"jobs">;
		title: string;
		skills: string[];
		hiresNeeded: number;
		location: "remote" | "hybrid" | "on-site";
		employmentType: "full-time" | "part-time";
		seniorityLevel:
			| "internship"
			| "entry-level"
			| "associate"
			| "mid-senior-level"
			| "director"
			| "executive"
			| "not-applicable";
		salaryMin: number;
		salaryMax: number;
		isActive?: boolean;
		_creationTime: number;
	};
	onEdit?: () => void;
}

export function JobCard({ job, onEdit }: JobCardProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isToggling, setIsToggling] = useState(false);

	const deleteJob = useMutation(api.jobs.deleteJob);
	const toggleStatus = useMutation(api.jobs.toggleJobStatus);

	const formatSalary = (min: number, max: number) => {
		const formatNumber = (num: number) => {
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(num);
		};
		return `${formatNumber(min)} - ${formatNumber(max)}/month`;
	};

	const formatLocation = (location: string) => {
		switch (location) {
			case "remote":
				return "Remote";
			case "hybrid":
				return "Hybrid";
			case "on-site":
				return "On-site";
			default:
				return location;
		}
	};

	const formatEmploymentType = (type: string) => {
		switch (type) {
			case "full-time":
				return "Full time";
			case "part-time":
				return "Part time";
			default:
				return type;
		}
	};

	const formatSeniorityLevel = (level: string) => {
		switch (level) {
			case "entry-level":
				return "Entry level";
			case "mid-senior-level":
				return "Mid-senior level";
			case "not-applicable":
				return "Not applicable";
			default:
				return level.charAt(0).toUpperCase() + level.slice(1);
		}
	};

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

	const handleToggleStatus = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsToggling(true);
		try {
			await toggleStatus({ id: job._id });
			toast.success(
				`Job ${job.isActive ? "deactivated" : "activated"} successfully!`,
			);
		} catch (error) {
			toast.error("Failed to update job status. Please try again.");
		} finally {
			setIsToggling(false);
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteJob({ id: job._id });
			toast.success("Job deleted successfully!");
			setShowDeleteDialog(false);
		} catch (error) {
			toast.error("Failed to delete job. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="relative">
				<Link to="/jobs/$jobId" params={{ jobId: job._id }}>
					<div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card hover:shadow-sm transition-all cursor-pointer group">
						<div className="flex-1 min-w-0 space-y-3">
							{/* Header */}
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<h3 className="text-base font-semibold truncate">
										{job.title}
									</h3>
									{job.isActive === false && (
										<Badge variant="destructive" className="text-xs">
											Inactive
										</Badge>
									)}
								</div>
							</div>

							{/* Main content */}
							<div className="flex flex-wrap items-center gap-2">
								{/* Job details */}
								<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
									<Tag className="h-3 w-3" />
									{job.skills.slice(0, 3).map((skill, index) => (
										<span key={skill}>
											{skill}
											{index < Math.min(job.skills.length, 3) - 1 && ","}
										</span>
									))}
									{job.skills.length > 3 && (
										<span>+{job.skills.length - 3} more</span>
									)}
									<div className="flex items-center gap-1">
										<MapPin className="h-3 w-3" />
										<span>{formatLocation(job.location)}</span>
									</div>
									<div className="flex items-center gap-1">
										<Briefcase className="h-3 w-3" />
										<span>{formatEmploymentType(job.employmentType)}</span>
									</div>
									<div className="flex items-center gap-1">
										<TrendingUp className="h-3 w-3" />
										<span>{formatSeniorityLevel(job.seniorityLevel)}</span>
									</div>
									<div className="flex items-center gap-1">
										<Users className="h-3 w-3" />
										<span>
											{job.hiresNeeded} hire{job.hiresNeeded > 1 ? "s" : ""}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<DollarSign className="h-3 w-3" />
										<span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
									</div>
								</div>
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
										<Edit className="h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleToggleStatus}
										disabled={isToggling}
									>
										{job.isActive !== false ? (
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
							This action cannot be undone. This will permanently delete the job
							posting and all associated data.
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
		</>
	);
}

export function JobCardSkeleton() {
	return (
		<div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card">
			<div className="flex-1 min-w-0 space-y-3">
				{/* Header */}
				<div className="flex items-start justify-between">
					<Skeleton className="h-5 w-48" />
				</div>

				{/* Main content */}
				<div className="flex flex-wrap items-center gap-2">
					{/* Skills */}
					<div className="flex flex-wrap items-center gap-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-14" />
					</div>

					{/* Job details */}
					<div className="flex flex-wrap items-center gap-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-28" />
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="ml-4">
				<Skeleton className="h-8 w-8 rounded" />
			</div>
		</div>
	);
}

export default JobCard;
