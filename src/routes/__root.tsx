/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
	Outlet,
	HeadContent,
	Scripts,
	ScriptOnce,
} from "@tanstack/react-router";

import appCss from "@/styles/app.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Compass - Smart talent acquisition platform",
			},
			{
				name: "description",
				content: "AI recruitment for modern talent acquisition teams",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "icon", href: "/logo.svg", type: "image/svg+xml" },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html suppressHydrationWarning lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="flex flex-col min-h-screen">
				<ScriptOnce>
					{`(()=>{
  const t = localStorage.getItem(
    ['assistants','jobs','talent'].includes(location.pathname.split('/')[1])
      ? 'vite-ui-app-theme'
      : 'vite-ui-root-theme'
  ) ?? (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  document.documentElement.className =
    document.documentElement.className.replace(/\b(?:dark|light)\b/g, '') + ' ' + t;
})();`}
				</ScriptOnce>
				{children}
				<Scripts />
				<Toaster />
			</body>
		</html>
	);
}
