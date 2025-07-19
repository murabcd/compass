import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/marketing/footer";
import { GridPattern } from "@/components/marketing/grid-pattern";
import { Header } from "@/components/marketing/header";

export const Route = createFileRoute("/_marketing")({
	component: MarketingLayout,
});

function MarketingLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 relative">
				<GridPattern />
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
