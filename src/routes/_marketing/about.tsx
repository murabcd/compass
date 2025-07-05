import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/marketing/about";

export const Route = createFileRoute("/_marketing/about")({
	component: About,
});
