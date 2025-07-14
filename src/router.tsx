import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

import { AlertCircle } from "lucide-react";

import { routeTree } from "./routeTree.gen";

import { EmptyState } from "@/components/empty-state";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";

function NotFound() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
			<EmptyState
				icon={AlertCircle}
				title="Page not found"
				description="Sorry, we couldn't find the page you're looking for."
				actionLabel="Go to home"
				onAction={() => {
					window.location.href = "/talent";
				}}
			/>
		</div>
	);
}

export function createRouter() {
	const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!;
	if (!CONVEX_URL) {
		console.error("missing envar VITE_CONVEX_URL");
	}
	const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
	});
	convexQueryClient.connect(queryClient);

	const convex = new ConvexReactClient(
		import.meta.env.VITE_CONVEX_URL as string,
	);

	const router = routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			defaultPreload: "intent",
			context: { queryClient },
			defaultNotFoundComponent: NotFound,
			Wrap: ({ children }) => (
				<ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
			),
		}),
		queryClient,
	);

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
