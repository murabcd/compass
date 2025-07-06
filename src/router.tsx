import {
	createRouter as createTanStackRouter,
	Link,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { routeTree } from "./routeTree.gen";
import { ConvexReactClient } from "convex/react";

function NotFound() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-muted-foreground">404</h1>
				<h2 className="text-2xl font-semibold mt-2">Page not found</h2>
				<p className="text-muted-foreground text-sm mt-2 text-center max-w-sm">
					Sorry, we couldn't find the page you're looking for.
				</p>
			</div>
			<Link
				to="/talent"
				className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			>
				Go to home
			</Link>
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
