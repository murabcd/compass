import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";

export const Route = createFileRoute("/_marketing/solutions/assistants")({
	component: AssistantsPage,
});

const features = [
	{
		name: "AI-powered conversations",
		description:
			"Engage with intelligent AI assistants that understand context and provide human-like responses.",
		icon: Bot,
	},
];

function AssistantsPage() {
	return (
		<div className="overflow-hidden py-24 sm:py-32">
			<div className="mx-auto max-w-5xl px-6 lg:px-8">
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
					<div className="lg:pt-4 lg:pr-8">
						<div className="lg:max-w-lg">
							<h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								AI assistants
							</h2>
							<p className="mt-6 text-lg leading-8 text-muted-foreground">
								Intelligent AI assistants to streamline your recruitment
								workflow.
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
						src="https://upbeat-setter-562.convex.cloud/api/storage/724609bc-69e4-43c2-b32f-22de2f7aedac"
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
