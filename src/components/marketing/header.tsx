import { Link } from "@tanstack/react-router";
import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/marketing/mobile-nav";

import { Nav } from "@/components/marketing/nav";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

export const Header = () => {
	const scrolled = useScroll();

	return (
		<header
			className={cn(
				"sticky top-0 z-20 w-full bg-transparent transition-all duration-300",
				scrolled && "bg-background/70 backdrop-blur-md",
			)}
		>
			<div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
				<Link to="/" className="flex items-center space-x-2 cursor-pointer">
					<Icons.compass className="size-6" />
					<span className="font-semibold text-xl">Compass</span>
				</Link>

				<div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
					<Nav />
				</div>

				<div className="hidden md:flex space-x-4">
					<Button variant="outline" asChild>
						<Link to="/login">Log in</Link>
					</Button>
					<Button asChild>
						<Link to="/register">Sign up</Link>
					</Button>
				</div>
				<div className="md:hidden">
					<MobileNav />
				</div>
			</div>
		</header>
	);
};
