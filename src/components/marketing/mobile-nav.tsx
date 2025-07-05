import React from "react";

import { Link } from "@tanstack/react-router";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

const platform = {
	title: "Platform",
	items: [{ title: "About", href: "/about" }],
};

const solutions = {
	title: "Solutions",
	items: [
		{
			title: "Talent sourcing",
			href: "/talent",
		},
		{
			title: "Job management",
			href: "/jobs",
		},
		{
			title: "AI assistants",
			href: "/assistants",
		},
	],
};

export const MobileNav = () => {
	const [open, setOpen] = React.useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="size-6" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:w-[400px] p-0">
				<div className="flex justify-between items-center p-4">
					<Link
						to="/"
						className="flex items-center"
						onClick={() => setOpen(false)}
					>
						<Icons.compass className="size-6 mr-2" />
						<span className="font-semibold text-xl">Compass</span>
					</Link>
				</div>
				<nav className="flex flex-col p-4">
					{platform.items.map((subItem) => (
						<Link
							key={subItem.title}
							to={subItem.href}
							className="py-2 text-sm"
							onClick={() => setOpen(false)}
						>
							{subItem.title}
						</Link>
					))}
					<Separator className="my-2" />
					{solutions.items.map((subItem) => (
						<Link
							key={subItem.title}
							to={subItem.href}
							className="py-2 text-sm"
							onClick={() => setOpen(false)}
						>
							{subItem.title}
						</Link>
					))}
					<Separator className="my-2" />
					<Link
						to="/pricing"
						className="py-2 text-sm"
						onClick={() => setOpen(false)}
					>
						Pricing
					</Link>
					<Link
						to="/login"
						className="py-2 text-sm"
						onClick={() => setOpen(false)}
					>
						Log In
					</Link>
					<div className="mt-4">
						<Button asChild className="w-full">
							<Link to="/register" onClick={() => setOpen(false)}>
								Get started
							</Link>
						</Button>
					</div>
				</nav>
			</SheetContent>
		</Sheet>
	);
};
