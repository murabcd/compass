"use client";

import * as React from "react";
import { Users, Briefcase, RectangleCircle, WandSparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

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
	user?: UserData;
	navMain?: NavItem[];
	userMenuItems?: Array<{
		label: string;
		icon: any;
		onClick?: () => void;
		variant?: "default" | "destructive";
	}>;
}

const defaultData = {
	user: {
		name: "User",
		email: "user@company.com",
		avatar: "/avatars/default.jpg",
	},
	navMain: [
		{
			title: "Talents",
			url: "/talents",
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
	user = defaultData.user,
	navMain = defaultData.navMain,
	userMenuItems,
	...props
}: AppSidebarProps) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent hover:text-primary"
						>
							<Link to="/talents">
								<RectangleCircle className="!size-5" />
								<span className="text-base font-semibold">Compass</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} menuItems={userMenuItems} />
			</SidebarFooter>
		</Sidebar>
	);
}
