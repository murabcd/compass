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
	Bot,
	MessageSquare,
	Calendar,
	FileText,
	TrendingUp,
	Clock,
} from "lucide-react";

export const Route = createFileRoute("/_marketing/solutions/assistants")({
	component: AssistantsPage,
});

function AssistantsPage() {
	const features = [
		{
			icon: Bot,
			title: "AI-powered conversations",
			description:
				"Engage with intelligent AI assistants that understand context and provide human-like responses.",
		},
		{
			icon: MessageSquare,
			title: "Multi-channel support",
			description:
				"Connect with candidates and clients across chat, voice, email, and video platforms seamlessly.",
		},
		{
			icon: Calendar,
			title: "Smart scheduling",
			description:
				"Automatically coordinate interviews and meetings based on availability and preferences.",
		},
		{
			icon: FileText,
			title: "Document processing",
			description:
				"Analyze resumes, extract key information, and generate interview questions automatically.",
		},
		{
			icon: TrendingUp,
			title: "Performance insights",
			description:
				"Track engagement metrics and conversation quality to optimize your recruitment process.",
		},
		{
			icon: Clock,
			title: "24/7 availability",
			description:
				"Provide round-the-clock support to candidates and stakeholders across different time zones.",
		},
	];

	return (
		<div className="w-full flex items-center justify-center py-12 md:py-24">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold text-center mb-4 md:text-5xl">
						AI assistants
					</h1>
					<p className="text-xl text-muted-foreground mb-8">
						Intelligent AI assistants to streamline your recruitment workflow
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
