import { useConvexAuth, useQuery } from "convex/react";

import { Briefcase, RectangleCircle, Users, WandSparkles } from "lucide-react";
import type React from "react";
import { api } from "@/../convex/_generated/api";
import { NavMain } from "@/components/nav-main";
import { NavUser, NavUserSkeleton } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
	title: string;
	url: string;
	icon: any;
	isActive?: boolean;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	navMain?: NavItem[];
	userMenuItems?: Array<{
		label: string;
		icon: any;
		onClick?: () => void;
		variant?: "default" | "destructive";
	}>;
}

const defaultData = {
	navMain: [
		{
			title: "Talent",
			url: "/talent",
			icon: Users,
		},
		{
			title: "Jobs",
			url: "/jobs",
			icon: Briefcase,
		},
		{
			title: "Assistants",
			url: "/assistants",
			icon: WandSparkles,
		},
	],
};

export function AppSidebar({
	navMain = defaultData.navMain,
	userMenuItems,
	...props
}: AppSidebarProps) {
	const { isAuthenticated } = useConvexAuth();

	const user = useQuery(api.users.getUser, isAuthenticated ? {} : "skip");

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
							className="hover:bg-transparent hover:text-primary"
						>
							<a href="/" className="relative">
								<div className="absolute left-0 bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<RectangleCircle className="size-4" />
								</div>
								<RectangleCircle className="size-4 invisible" />
								<span className="text-base font-semibold ml-2">Compass</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				{user ? (
					<NavUser user={user} menuItems={userMenuItems} />
				) : (
					<NavUserSkeleton />
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
