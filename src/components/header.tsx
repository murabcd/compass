import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

function getBreadcrumbItems(
	pathname: string,
	names: { [key: string]: string },
	loadingStates: { [key: string]: boolean },
) {
	const segments = pathname.split("/").filter(Boolean);
	const items: Array<{
		label: string;
		href: string;
		isActive: boolean;
		isLoading?: boolean;
	}> = [];

	if (segments.length === 0) {
		return [{ label: "Home", href: "/", isActive: true }];
	}

	if (segments[0] === "jobs") {
		items.push({
			label: "Jobs",
			href: "/jobs",
			isActive: pathname === "/jobs",
		});

		if (segments[1]) {
			const jobKey = `job-${segments[1]}`;
			const jobName = names[jobKey];
			const isLoadingJob = loadingStates[jobKey];

			items.push({
				label: jobName || `Job ${segments[1]}`,
				href: `/jobs/${segments[1]}`,
				isActive: true,
				isLoading: isLoadingJob,
			});
		}
	} else if (segments[0] === "assistants") {
		items.push({
			label: "Assistants",
			href: "/assistants",
			isActive: pathname === "/assistants",
		});

		if (segments[1]) {
			const assistantKey = `assistant-${segments[1]}`;
			const assistantName = names[assistantKey];
			const isLoadingAssistant = loadingStates[assistantKey];

			items.push({
				label: assistantName || `Assistant ${segments[1]}`,
				href: `/assistants/${segments[1]}`,
				isActive: true,
				isLoading: isLoadingAssistant,
			});
		}
	} else if (segments[0] === "talent") {
		items.push({
			label: "Talent",
			href: "/talent",
			isActive: pathname === "/talent",
		});

		if (segments[1]) {
			const talentKey = `talent-${segments[1]}`;
			const talentName = names[talentKey];
			const isLoadingTalent = loadingStates[talentKey];

			items.push({
				label: talentName || `Talent ${segments[1]}`,
				href: `/talent/${segments[1]}`,
				isActive: true,
				isLoading: isLoadingTalent,
			});
		}
	} else {
		items.push({
			label: segments[0].charAt(0).toUpperCase() + segments[0].slice(1),
			href: `/${segments[0]}`,
			isActive: segments.length === 1,
		});
	}

	return items;
}

export function Header() {
	const location = useLocation();
	const segments = location.pathname.split("/").filter(Boolean);

	const assistantId =
		segments[0] === "assistants" && segments[1]
			? (segments[1] as Id<"assistants">)
			: null;
	const jobId =
		segments[0] === "jobs" && segments[1] ? (segments[1] as Id<"jobs">) : null;
	const talentId =
		segments[0] === "talent" && segments[1]
			? (segments[1] as Id<"talent">)
			: null;

	const { data: assistant, isLoading: isLoadingAssistant } = useQuery(
		convexQuery(
			api.assistants.getAssistant,
			assistantId ? { id: assistantId } : "skip",
		),
	);

	const { data: job, isLoading: isLoadingJob } = useQuery(
		convexQuery(api.jobs.getJob, jobId ? { id: jobId } : "skip"),
	);

	const { data: talent, isLoading: isLoadingTalent } = useQuery(
		convexQuery(
			api.talents.getTalentById,
			talentId ? { id: talentId } : "skip",
		),
	);

	const names: { [key: string]: string } = {};
	if (assistant && assistantId) {
		names[`assistant-${assistantId}`] = assistant.name;
	}
	if (job && jobId) {
		names[`job-${jobId}`] = job.title;
	}
	if (talent && talentId) {
		names[`talent-${talentId}`] = talent.name;
	}

	const loadingStates: { [key: string]: boolean } = {};
	if (assistantId) {
		loadingStates[`assistant-${assistantId}`] = isLoadingAssistant;
	}
	if (jobId) {
		loadingStates[`job-${jobId}`] = isLoadingJob;
	}
	if (talentId) {
		loadingStates[`talent-${talentId}`] = isLoadingTalent;
	}

	const breadcrumbItems = getBreadcrumbItems(
		location.pathname,
		names,
		loadingStates,
	);

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1 cursor-pointer" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbItems.map((item, index) => (
							<React.Fragment key={item.href}>
								<BreadcrumbItem>
									{item.isActive && index === breadcrumbItems.length - 1 ? (
										<BreadcrumbPage>
											{item.isLoading ? (
												<Skeleton className="h-4 w-24" />
											) : (
												item.label
											)}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link to={item.href}>
												{item.isLoading ? (
													<Skeleton className="h-4 w-20" />
												) : (
													item.label
												)}
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
								{index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<div className="ml-auto flex items-center gap-2">
					<Button variant="ghost" asChild size="sm" className="hidden sm:flex">
						<a
							href="https://github.com/murabcd/compass"
							rel="noopener noreferrer"
							target="_blank"
							className="dark:text-foreground"
						>
							GitHub
						</a>
					</Button>
				</div>
			</div>
		</header>
	);
}
