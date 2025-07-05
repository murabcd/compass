import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/talent/$talentId")({
	component: Talent,
});

function Talent() {
	const { talentId } = Route.useParams();
	return <div>Talent ID: {talentId}</div>;
}
