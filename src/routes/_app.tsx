import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useConvexAuth } from "convex/react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

export const Route = createFileRoute("/_app")({
	component: AppLayout,
});

function AppLayout() {
	const { isLoading, isAuthenticated } = useConvexAuth();
	const navigate = useNavigate();

	// Redirect unauthenticated users to the login page
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			void navigate({ to: "/login", replace: true });
		}
	}, [isLoading, isAuthenticated, navigate]);

	if (!isLoading && !isAuthenticated) {
		return null;
	}

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-app-theme">
			<SidebarProvider
				style={
					{
						"--sidebar-width": "calc(var(--spacing) * 72)",
						"--header-height": "calc(var(--spacing) * 12)",
					} as React.CSSProperties
				}
			>
				<AppSidebar variant="inset" />
				<SidebarInset>
					<Header />
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</ThemeProvider>
	);
}
