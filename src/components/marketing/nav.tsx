import { Link } from "@tanstack/react-router";
import * as React from "react";

import { Icons } from "@/components/icons";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const solutions: { title: string; href: string; description: string }[] = [
	{
		title: "Talent sourcing",
		href: "/talent",
		description:
			"Discover and connect with top global talent using AI-powered matching",
	},
	{
		title: "Job management",
		href: "/jobs",
		description:
			"Create, manage, and track your job postings across multiple channels",
	},
	{
		title: "AI assistants",
		href: "/assistants",
		description:
			"Automate recruitment tasks with intelligent AI-powered assistants",
	},
];

export const Nav = () => {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Platform</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<Link
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
										to="/"
									>
										<Icons.compass className="size-4" />
										<div className="mb-2 mt-4 text-lg font-medium">Compass</div>
										<p className="text-sm leading-tight text-muted-foreground">
											AI recruitment for modern talent acquisition teams
										</p>
									</Link>
								</NavigationMenuLink>
							</li>
							<ListItem to="/about" title="About">
								Learn more about Compass, our mission, and our vision for
								recruitment
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{solutions.map((item) => (
								<ListItem key={item.title} title={item.title} to={item.href}>
									{item.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
						<Link to="/pricing">Pricing</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

const ListItem = React.forwardRef<
	React.ElementRef<typeof Link>,
	React.ComponentPropsWithoutRef<typeof Link> & {
		title: string;
		children: React.ReactNode;
	}
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
