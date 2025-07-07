"use client";

import type React from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { Users, Briefcase, RectangleCircle, WandSparkles } from "lucide-react";

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
import { api } from "@/../convex/_generated/api";

interface UserData {
	name: string;
	email: string;
	avatar: string;
}

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
	const { isLoading, isAuthenticated } = useConvexAuth();

	const user = useQuery(
		api.users.getUser,
		{},
		{
			enabled: !isLoading && isAuthenticated,
			staleTime: Infinity,
		},
	);

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent hover:text-primary"
						>
							<a href="/">
								<RectangleCircle className="!size-5" />
								<span className="text-base font-semibold">Compass</span>
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
