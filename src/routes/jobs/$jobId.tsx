import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs/$jobId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/jobs/$jobId"!</div>;
}
