import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { CandidateList } from "@/components/candidate-list";
import { JobHeader } from "@/components/job-header";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute("/_app/jobs/$jobId")({
	component: Job,
});

function Job() {
	const { jobId } = Route.useParams();

	const { data: job, isLoading: jobLoading } = useQuery(
		convexQuery(api.jobs.getJob, { id: jobId as Id<"jobs"> }),
	);

	const { data: candidates, isLoading: candidatesLoading } = useQuery(
		convexQuery(api.candidates.getCandidatesByJob, {
			jobId: jobId as Id<"jobs">,
		}),
	);

	if (jobLoading || candidatesLoading) {
		return <JobDetailSkeleton />;
	}

	if (!job) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="text-center">
					<h3 className="text-lg font-medium">Job not found</h3>
					<p className="text-muted-foreground">
						The job you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-6 py-6">
				<JobHeader job={job} />

				<div className="px-4 lg:px-6">
					<CandidateList candidates={candidates} />
				</div>
			</div>
		</div>
	);
}

function JobDetailSkeleton() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-6 py-6">
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

						<div className="flex gap-2">
							{Array.from({ length: 5 }, () => (
								<Skeleton
									key={`job-detail-badge-${Math.random()}`}
									className="h-6 w-20"
								/>
							))}
						</div>

						<div className="flex gap-2">
							{Array.from({ length: 4 }, () => (
								<Skeleton
									key={`job-skill-badge-${Math.random()}`}
									className="h-6 w-16"
								/>
							))}
						</div>
					</div>
				</div>

				<div className="px-4 lg:px-6">
					<Skeleton className="h-10 w-80 mb-6" />
					<div className="space-y-3">
						{Array.from({ length: 4 }, () => (
							<div
								key={`applicant-skeleton-${Math.random()}`}
								className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-card dark:bg-card"
							>
								<div className="flex items-center gap-4 flex-1">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="flex-1 space-y-3">
										<Skeleton className="h-5 w-48" />
										<div className="flex flex-wrap items-center gap-4">
											<Skeleton className="h-3 w-16" />
											<Skeleton className="h-3 w-20" />
											<Skeleton className="h-3 w-14" />
											<Skeleton className="h-3 w-24" />
											<Skeleton className="h-3 w-32" />
										</div>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-center space-y-1">
										<Skeleton className="h-3 w-16" />
										<Skeleton className="h-6 w-10" />
									</div>
									<div className="text-center space-y-1">
										<Skeleton className="h-3 w-14" />
										<Skeleton className="h-3 w-16" />
									</div>
									<Skeleton className="h-8 w-8" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
