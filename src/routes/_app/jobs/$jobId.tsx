import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/jobs/$jobId")({
	component: Job,
});

function Job() {
	const { jobId } = Route.useParams();
	return <div>Job ID: {jobId}</div>;
}
