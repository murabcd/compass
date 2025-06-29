import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/candidates")({
  component: Candidates,
});

function Candidates() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Candidates</h1>
            <p className="text-muted-foreground">Manage your candidate pipeline</p>
          </div>
        </div>
      </div>
    </div>
  );
}
