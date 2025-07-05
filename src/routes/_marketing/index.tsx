import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/marketing/hero";

export const Route = createFileRoute("/_marketing/")({
	component: Home,
});

function Home() {
	return <Hero />;
}
