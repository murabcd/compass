"use client";

import * as React from "react";
import {
  Users,
  Calendar,
  LayoutDashboard,
  Briefcase,
  RectangleCircle,
} from "lucide-react";

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
      isActive: true,
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
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/dashboard">
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
        <NavUser user={user} menuItems={userMenuItems} />
      </SidebarFooter>
    </Sidebar>
  );
}
