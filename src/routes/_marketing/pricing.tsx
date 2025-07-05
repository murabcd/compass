import { createFileRoute } from "@tanstack/react-router";

import { Pricing } from "@/components/marketing/pricing";

export const Route = createFileRoute("/_marketing/pricing")({
	component: Pricing,
});
