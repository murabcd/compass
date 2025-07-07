import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
	Plus,
	Radio,
	BarChart3,
	Users,
	Workflow,
	ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/_marketing/solutions/jobs")({
	component: JobsPage,
});

function JobsPage() {
	const features = [
		{
			icon: Plus,
			title: "Smart job creation",
			description:
				"Create compelling job postings with AI assistance that optimizes descriptions for better candidate attraction.",
		},
		{
			icon: Radio,
			title: "Multi-channel publishing",
			description:
				"Automatically post to 100+ job boards and social platforms with a single click. Maximize your reach effortlessly.",
		},
		{
			icon: BarChart3,
			title: "Performance analytics",
			description:
				"Track application rates, source effectiveness, and hiring metrics with detailed analytics and insights.",
		},
		{
			icon: Users,
			title: "Team collaboration",
			description:
				"Enable seamless collaboration between hiring managers, recruiters, and team members throughout the process.",
		},
		{
			icon: Workflow,
			title: "Automated workflows",
			description:
				"Set up custom hiring pipelines with automated status updates, notifications, and candidate progression.",
		},
		{
			icon: ShieldCheck,
			title: "Compliance management",
			description:
				"Ensure EEOC compliance and maintain audit trails with built-in compliance monitoring and reporting.",
		},
	];

	return (
		<div className="w-full flex items-center justify-center py-12 md:py-24">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold text-center mb-4 md:text-5xl">
						Job management
					</h1>
					<p className="text-xl text-muted-foreground mb-8">
						Create, manage, and track your job postings across multiple channels
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature) => {
						const IconComponent = feature.icon;
						return (
							<Card key={feature.title}>
								<CardHeader>
									<div className="w-8 h-8 mb-2">
										<IconComponent className="w-full h-full" />
									</div>
									<CardTitle className="text-lg">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{feature.description}</CardDescription>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}
