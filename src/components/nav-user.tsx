import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "@tanstack/react-router";
import type { Doc } from "convex/_generated/dataModel";
import { LogOut, MoreVertical, Settings } from "lucide-react";
import * as React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SettingsDialog } from "@/components/settings-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";

interface UserMenuItem {
	label: string;
	icon: any;
	onClick?: () => void;
	variant?: "default" | "destructive";
}

interface NavUserProps {
	user: Doc<"users">;
	menuItems?: UserMenuItem[];
}

export function NavUser({ user, menuItems }: NavUserProps) {
	const { isMobile } = useSidebar();
	const { signOut } = useAuthActions();
	const router = useRouter();
	const [settingsOpen, setSettingsOpen] = React.useState(false);

	const defaultMenuItems: UserMenuItem[] = [
		{
			label: "Settings",
			icon: Settings,
			onClick: () => setSettingsOpen(true),
		},
		{
			label: "Log out",
			icon: LogOut,
			variant: "destructive" as const,
			onClick: () => {
				const rootTheme = localStorage.getItem("vite-ui-root-theme") || "dark";
				document.documentElement.className =
					document.documentElement.className.replace(
						/\b(?:dark|light)\b/g,
						"",
					) +
					" " +
					rootTheme;
				void signOut();
				void router.navigate({ to: "/" });
			},
		},
	];

	const finalMenuItems = menuItems || defaultMenuItems;

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10 cursor-pointer">
								<Avatar className="h-6 w-6 border rounded-lg">
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
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<ModeToggle />
							<DropdownMenuGroup>
								{finalMenuItems.map((item) => (
									<DropdownMenuItem
										key={item.label}
										onClick={item.onClick}
										variant={item.variant}
										className={
											item.label === "Settings" || item.label === "Log out"
												? "cursor-pointer"
												: undefined
										}
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
			<SettingsDialog
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
				user={user}
			/>
		</>
	);
}

export function NavUserSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton className="h-10">
					<Skeleton className="h-6 w-6 rounded-lg" />
					<div className="grid flex-1 text-left text-sm leading-tight">
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="ml-auto h-4 w-4" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
