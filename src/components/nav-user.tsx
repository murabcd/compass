"use client";

import { useRouter } from "@tanstack/react-router";
import { Settings, MoreVertical, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useAuthActions } from "@convex-dev/auth/react";

interface UserMenuItem {
	label: string;
	icon: any;
	onClick?: () => void;
	variant?: "default" | "destructive";
}

interface NavUserProps {
	user: {
		name: string;
		email: string;
		image: string;
	};
	menuItems?: UserMenuItem[];
}

const defaultMenuItems: UserMenuItem[] = [
	{
		label: "Settings",
		icon: Settings,
	},
	// {
	//   label: "Notifications",
	//   icon: Bell,
	// },
	{
		label: "Log out",
		icon: LogOut,
		variant: "destructive" as const,
	},
];

export function NavUser({ user, menuItems = defaultMenuItems }: NavUserProps) {
	const { isMobile } = useSidebar();
	const { signOut } = useAuthActions();
	const router = useRouter();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
							<Avatar className="h-6 w-6 border rounded-lg grayscale">
								<AvatarImage src={user.image} alt={user.name} />
								<AvatarFallback className="rounded-lg">
									{user.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate">{user.name}</span>
							</div>
							<MoreVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "top"}
						align="end"
						sideOffset={4}
					>
						<ModeToggle />
						<DropdownMenuGroup>
							{menuItems.map((item) => (
								<DropdownMenuItem
									key={item.label}
									onClick={
										item.label === "Log out"
											? () => {
													void signOut();
													void router.navigate({ to: "/" });
												}
											: item.onClick
									}
									variant={item.variant}
								>
									<item.icon className="h-4 w-4" />
									{item.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
