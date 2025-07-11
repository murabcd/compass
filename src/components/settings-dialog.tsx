import * as React from "react";
import { Paintbrush, User, Database } from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@/components/ui/sidebar";
import {
	ProfileSettings,
	AppearanceSettings,
	DataControlsSettings,
} from "@/components/settings";
import type { Doc } from "convex/_generated/dataModel";

const data = {
	nav: [
		{ name: "Profile", icon: User },
		{ name: "Appearance", icon: Paintbrush },
		{ name: "Data controls", icon: Database },
	],
};

interface SettingsDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	user?: Doc<"users">;
}

export function SettingsDialog({
	open,
	onOpenChange,
	user,
}: SettingsDialogProps) {
	const [activeSection, setActiveSection] = React.useState("Profile");

	const renderContent = () => {
		switch (activeSection) {
			case "Profile":
				return <ProfileSettings user={user} />;
			case "Appearance":
				return <AppearanceSettings />;
			case "Data controls":
				return <DataControlsSettings />;
			default:
				return <ProfileSettings user={user} />;
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
				<DialogTitle className="sr-only">Settings</DialogTitle>
				<DialogDescription className="sr-only">
					Customize your settings here.
				</DialogDescription>
				<SidebarProvider className="items-start">
					<Sidebar collapsible="none" className="hidden md:flex">
						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupContent>
									<SidebarMenu>
										{data.nav.map((item) => (
											<SidebarMenuItem key={item.name}>
												<SidebarMenuButton
													isActive={item.name === activeSection}
													onClick={() => setActiveSection(item.name)}
												>
													<item.icon />
													<span>{item.name}</span>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>
					<main className="flex h-[480px] flex-1 flex-col overflow-hidden">
						<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
							<div className="flex items-center gap-2 px-4">
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem className="hidden md:block">
											<BreadcrumbLink
												onClick={() => setActiveSection("Profile")}
												className="cursor-pointer"
											>
												Settings
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator className="hidden md:block" />
										<BreadcrumbItem>
											<BreadcrumbPage>{activeSection}</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>
						</header>
						<div className="flex flex-1 flex-col overflow-y-auto">
							{renderContent()}
						</div>
					</main>
				</SidebarProvider>
			</DialogContent>
		</Dialog>
	);
}
