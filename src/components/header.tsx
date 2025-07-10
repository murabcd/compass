import React from "react";

import { useLocation, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

function getBreadcrumbItems(
	pathname: string,
	names: { [key: string]: string },
) {
	const segments = pathname.split("/").filter(Boolean);
	const items: Array<{ label: string; href: string; isActive: boolean }> = [];

	if (segments.length === 0) {
		// Root page - shouldn't happen in app routes, but just in case
		return [{ label: "Home", href: "/", isActive: true }];
	}

	if (segments[0] === "jobs") {
		items.push({
			label: "Jobs",
			href: "/jobs",
			isActive: pathname === "/jobs",
		});

		if (segments[1]) {
			const jobName = names[`job-${segments[1]}`] || `Job ${segments[1]}`;
			items.push({
				label: jobName,
				href: `/jobs/${segments[1]}`,
				isActive: true,
			});
		}
	} else if (segments[0] === "assistants") {
		items.push({
			label: "Assistants",
			href: "/assistants",
			isActive: pathname === "/assistants",
		});

		if (segments[1]) {
			const assistantName =
				names[`assistant-${segments[1]}`] || `Assistant ${segments[1]}`;
			items.push({
				label: assistantName,
				href: `/assistants/${segments[1]}`,
				isActive: true,
			});
		}
	} else if (segments[0] === "talent") {
		items.push({
			label: "Talent",
			href: "/talent",
			isActive: pathname === "/talent",
		});

		if (segments[1]) {
			const talentName =
				names[`talent-${segments[1]}`] || `Talent ${segments[1]}`;
			items.push({
				label: talentName,
				href: `/talent/${segments[1]}`,
				isActive: true,
			});
		}
	} else {
		// Fallback for other routes
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

	// Fetch assistant when id present
	const { data: assistant } = useQuery({
		...convexQuery(api.assistants.getAssistant, {
			// biome-ignore lint/style/noNonNullAssertion: Value is non-null when hook enabled.
			id: assistantId!,
		}),
		enabled: !!assistantId,
	});

	// Fetch job when id present
	const { data: job } = useQuery({
		...convexQuery(api.jobs.getJob, {
			// biome-ignore lint/style/noNonNullAssertion: Value is non-null when hook enabled.
			id: jobId!,
		}),
		enabled: !!jobId,
	});

	// Fetch talent when id present
	const { data: talent } = useQuery({
		...convexQuery(api.talents.getTalentById, {
			// biome-ignore lint/style/noNonNullAssertion: Value is non-null when hook enabled.
			id: talentId!,
		}),
		enabled: !!talentId,
	});

	// Build names object for breadcrumbs
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

	const breadcrumbItems = getBreadcrumbItems(location.pathname, names);

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
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
										<BreadcrumbPage>{item.label}</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link to={item.href}>{item.label}</Link>
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
