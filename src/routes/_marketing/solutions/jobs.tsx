import { createFileRoute } from "@tanstack/react-router";
import { Plus, Workflow } from "lucide-react";

export const Route = createFileRoute("/_marketing/solutions/jobs")({
	component: JobsPage,
});

const features = [
	{
		name: "Smart job creation",
		description:
			"Create compelling job postings with AI assistance that optimizes descriptions for better candidate attraction.",
		icon: Plus,
	},
	{
		name: "Automated workflows",
		description:
			"Set up custom hiring pipelines with automated status updates, notifications, and candidate progression.",
		icon: Workflow,
	},
];

function JobsPage() {
	return (
		<div className="overflow-hidden py-24 sm:py-32">
			<div className="mx-auto max-w-5xl px-6 lg:px-8">
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
					<div className="lg:pt-4 lg:pr-8">
						<div className="lg:max-w-lg">
							<h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Job management
							</h2>
							<p className="mt-6 text-lg leading-8 text-muted-foreground">
								Create, manage, and track your job postings across multiple
								channels.
							</p>
							<dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-muted-foreground lg:max-w-none">
								{features.map((feature) => (
									<div key={feature.name} className="relative pl-9">
										<dt className="inline font-semibold text-foreground">
											<feature.icon
												aria-hidden="true"
												className="absolute left-1 top-1 h-5 w-5 text-primary"
											/>
											{feature.name}
										</dt>{" "}
										<dd className="inline">{feature.description}</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
					<img
						alt="Product screenshot"
						src="https://upbeat-setter-562.convex.cloud/api/storage/8d5f4a27-e9a1-4e6e-8773-f3530ea3135e"
						width={2432}
						height={1442}
						loading="eager"
						fetchPriority="high"
						className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-border sm:w-[57rem] md:-ml-4 lg:-ml-0"
					/>
				</div>
			</div>
		</div>
	);
}
