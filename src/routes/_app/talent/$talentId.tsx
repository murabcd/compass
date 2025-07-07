import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import {
	User,
	Calendar,
	Phone,
	ChevronDown,
	Bot,
	Video,
	Briefcase,
	FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute("/_app/talent/$talentId")({
	component: TalentDetail,
});

function TalentDetail() {
	const { talentId } = Route.useParams();

	const { data: talent, isLoading } = useQuery(
		convexQuery(api.talents.getTalentById, {
			id: talentId as Id<"talent">,
		}),
	);

	const formatSalary = (num: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(num);
	};

	const formatExperience = (years: number) => {
		return `${years} year${years !== 1 ? "s" : ""}`;
	};

	const formatDate = (timestamp: number) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		}).format(new Date(timestamp));
	};

	if (isLoading) {
		return <TalentDetailSkeleton />;
	}

	if (!talent) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="text-center">
					<h3 className="text-lg font-medium">Talent not found</h3>
					<p className="text-muted-foreground">
						The talent profile you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-6 py-6">
				{/* Header */}
				<div className="px-4 lg:px-6">
					<div className="space-y-4">
						<div className="flex items-start justify-between">
							<div>
								<h1 className="text-2xl font-bold">{talent.title}</h1>
								<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<Calendar className="h-4 w-4" />
										<span>Joined: {formatDate(talent._creationTime)}</span>
									</div>
									<div className="flex items-center gap-1">
										<User className="h-4 w-4" />
										<span>Talent: {talent.name}</span>
									</div>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className="gap-2">
										<Phone className="h-4 w-4" />
										Request interview
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuItem className="gap-2">
										<Bot className="h-4 w-4" />
										Let AI do the interview
									</DropdownMenuItem>
									<DropdownMenuItem className="gap-2">
										<Video className="h-4 w-4" />
										Do the interview yourself
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Talent Details */}
						<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
							<Badge variant="outline">{talent.country}</Badge>
							<Badge variant="outline">remote</Badge>
							<Badge variant="outline">
								{formatExperience(talent.experience)}
							</Badge>
							<Badge variant="outline">
								{formatSalary(talent.salaryMonth)}/month
							</Badge>
						</div>

						{/* Skills */}
						<div className="flex flex-wrap gap-2">
							{talent.vettedSkills.map((skill) => (
								<Badge key={skill} variant="secondary">
									{skill}
								</Badge>
							))}
						</div>
					</div>
				</div>

				{/* About */}
				<div className="px-4 lg:px-6">
					<div className="space-y-3">
						<h2 className="text-lg font-semibold">About</h2>
						<div className="p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card min-h-[80px]">
							{talent.description ? (
								<p className="text-xs text-muted-foreground leading-relaxed">
									{talent.description}
								</p>
							) : (
								<div className="flex items-center justify-center h-full text-center">
									<div className="space-y-2">
										<FileText className="h-6 w-6 mx-auto text-muted-foreground" />
										<p className="text-xs text-muted-foreground">
											No description available
										</p>
										<p className="text-xs text-muted-foreground opacity-75">
											About section will appear here when added
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* AI Interview Recording */}
				<div className="px-4 lg:px-6">
					<div className="space-y-3">
						<h2 className="text-lg font-semibold">AI Interview Transcript</h2>
						<div className="flex items-center justify-center p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card">
							<div className="space-y-2 text-center">
								<Bot className="h-6 w-6 mx-auto text-muted-foreground" />
								<p className="text-xs text-muted-foreground">
									No AI interview conducted yet
								</p>
								<p className="text-xs text-muted-foreground opacity-75">
									Request an AI interview to see the transcript here
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Experience */}
				<div className="px-4 lg:px-6">
					<div className="space-y-3">
						<h2 className="text-lg font-semibold">Experience</h2>
						<div className="flex items-center justify-center p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card">
							<div className="space-y-2 text-center">
								<Briefcase className="h-6 w-6 mx-auto text-muted-foreground" />
								<p className="text-xs text-muted-foreground">
									No work experience added yet
								</p>
								<p className="text-xs text-muted-foreground opacity-75">
									Experience details will appear here when available
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function TalentDetailSkeleton() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-6 py-6">
				{/* Header Skeleton */}
				<div className="px-4 lg:px-6">
					<div className="space-y-4">
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<Skeleton className="h-8 w-64" />
								<div className="flex items-center gap-4">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-4 w-48" />
								</div>
							</div>
							<Skeleton className="h-10 w-40" />
						</div>

						{/* Talent Details Skeleton */}
						<div className="flex gap-2">
							{Array.from({ length: 4 }, () => (
								<Skeleton
									key={`talent-detail-badge-${Math.random()}`}
									className="h-6 w-20"
								/>
							))}
						</div>

						{/* Skills Skeleton */}
						<div className="flex gap-2">
							{Array.from({ length: 6 }, () => (
								<Skeleton
									key={`skill-skeleton-${Math.random()}`}
									className="h-6 w-16"
								/>
							))}
						</div>
					</div>
				</div>

				{/* About Skeleton */}
				<div className="px-4 lg:px-6">
					<div className="space-y-3">
						<Skeleton className="h-6 w-16" />
						<div className="flex items-center justify-center p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card min-h-[80px]">
							<div className="space-y-2 text-center">
								<Skeleton className="h-6 w-6 mx-auto rounded" />
								<Skeleton className="h-3 w-40" />
								<Skeleton className="h-3 w-48" />
							</div>
						</div>
					</div>
				</div>

				{/* AI Interview Skeleton */}
				<div className="px-4 lg:px-6">
					<div className="space-y-3">
						<Skeleton className="h-6 w-36" />
						<div className="flex items-center justify-center p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card">
							<div className="space-y-2 text-center">
								<Skeleton className="h-6 w-6 mx-auto rounded" />
								<Skeleton className="h-3 w-44" />
								<Skeleton className="h-3 w-64" />
							</div>
						</div>
					</div>
				</div>

				{/* Experience Skeleton */}
				<div className="px-4 lg:px-6">
					<div className="space-y-3">
						<Skeleton className="h-6 w-24" />
						<div className="flex items-center justify-center p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card">
							<div className="space-y-2 text-center">
								<Skeleton className="h-6 w-6 mx-auto rounded" />
								<Skeleton className="h-3 w-48" />
								<Skeleton className="h-3 w-56" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
