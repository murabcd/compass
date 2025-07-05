import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Hero = () => {
	return (
		<div className="w-full min-h-[70vh] flex items-center justify-center">
			<div className="mx-auto max-w-2xl px-4 text-center">
				<div className="flex flex-col relative">
					<h1 className="text-4xl font-bold mb-4 relative md:text-5xl">
						AI recruitment for modern talent acquisition teams
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl">
						Source and onboard talent all in one place
					</p>
				</div>
				<div className="flex justify-center items-center mt-10">
					<Link to="/register">
						<Button>Start hiring</Button>
					</Link>
					<div className="ml-4">
						<Link
							to="/about"
							className="text-muted-foreground hover:text-foreground"
						>
							Learn more <span aria-hidden="true">→</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
