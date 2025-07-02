"use client";

import * as React from "react";
import {
  Users,
  Calendar,
  LayoutDashboard,
  Briefcase,
  RectangleCircle,
  WandSparkles,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

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

// Default data - ultra-simple for Micro1 clone
const defaultData = {
  user: {
    name: "User",
    email: "user@company.com",
    avatar: "/avatars/default.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Candidates",
      url: "/candidates",
      icon: Users,
    },
    {
      title: "Jobs",
      url: "/jobs",
      icon: Briefcase,
    },
    {
      title: "Interviews",
      url: "/interviews",
      icon: Calendar,
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
  const location = useLocation();

  // Dynamically set isActive based on current route
  const navItemsWithActiveState = navMain.map((item) => ({
    ...item,
    isActive:
      location.pathname === item.url ||
      (item.url === "/dashboard" &&
        (location.pathname === "/dashboard/" || location.pathname === "/")),
  }));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent hover:text-primary"
            >
              <Link to="/dashboard">
                <RectangleCircle className="!size-5" />
                <span className="text-base font-semibold">Compass</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItemsWithActiveState} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} menuItems={userMenuItems} />
      </SidebarFooter>
    </Sidebar>
  );
}
