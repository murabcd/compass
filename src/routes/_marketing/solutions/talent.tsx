import { createFileRoute } from "@tanstack/react-router";

import { Search, Target, Globe, Zap, Shield, TrendingUp } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_marketing/solutions/talent")({
	component: TalentPage,
});

function TalentPage() {
	const features = [
		{
			icon: Search,
			title: "AI-powered search",
			description:
				"Find the perfect candidates using advanced AI algorithms that understand context and skills beyond keywords.",
		},
		{
			icon: Target,
			title: "Smart matching",
			description:
				"Our intelligent matching system considers culture fit, technical skills, and career goals for better placements.",
		},
		{
			icon: Globe,
			title: "Global talent pool",
			description:
				"Access a diverse network of professionals from around the world, ready to join your team.",
		},
		{
			icon: Zap,
			title: "Instant results",
			description:
				"Get qualified candidate recommendations in minutes, not weeks. Speed up your hiring process significantly.",
		},
		{
			icon: Shield,
			title: "Verified profiles",
			description:
				"All talent profiles are verified and validated to ensure you're connecting with genuine professionals.",
		},
		{
			icon: TrendingUp,
			title: "Continuous learning",
			description:
				"Our AI learns from your hiring decisions to provide better recommendations over time.",
		},
	];

	return (
		<div className="w-full flex items-center justify-center py-12 md:py-24">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold text-center mb-4 md:text-5xl">
						Talent sourcing
					</h1>
					<p className="text-xl text-muted-foreground mb-8">
						Discover and connect with top global talent using AI-powered
						matching
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
