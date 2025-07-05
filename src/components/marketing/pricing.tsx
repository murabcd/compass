import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
	"Unlimited candidates",
	"Unlimited jobs",
	"Unlimited AI credits",
	"Unlimited insights",
];

export const Pricing = () => {
	return (
		<div className="w-full flex items-center justify-center py-12 md:py-20">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="text-4xl font-bold text-center mb-4 md:text-5xl">
						Simple pricing
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-balance text-muted-foreground">
						We're offering full access for free. No hidden fees, no credit card
						required.
					</p>
				</div>
				<div className="mx-auto mt-10 max-w-2xl rounded-2xl border sm:mt-12 lg:mx-0 lg:flex lg:max-w-none">
					<div className="p-6 sm:p-8 lg:flex-auto">
						<h3 className="text-2xl font-bold tracking-tight">Free forever</h3>
						<p className="mt-6 text-base leading-7 text-muted-foreground">
							Get complete access to every feature.
						</p>
						<div className="mt-10 flex items-center gap-x-4">
							<h4 className="flex-none text-sm font-semibold leading-6">
								What's included
							</h4>
						</div>
						<ul className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-muted-foreground sm:grid-cols-2 sm:gap-6">
							{features.map((feature) => (
								<li key={feature} className="flex gap-x-3">
									<Check className="h-6 w-5 flex-none" aria-hidden="true" />
									{feature}
								</li>
							))}
						</ul>
					</div>
					<div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
						<div className="h-full rounded-2xl bg-muted/30 py-10 text-center ring-1 ring-inset ring-foreground/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
							<div className="mx-auto max-w-xs px-8">
								<p className="text-base font-semibold">Free forever</p>
								<p className="mt-6 flex items-baseline justify-center gap-x-2">
									<span className="text-5xl font-bold tracking-tight">$0</span>
									<span className="text-sm font-semibold leading-6 tracking-wide">
										USD
									</span>
								</p>
								<Button asChild className="mt-10">
									<Link to="/register">Get started</Link>
								</Button>
								<p className="mt-6 text-xs leading-5 text-muted-foreground">
									Compass will remain free forever.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Pricing;
