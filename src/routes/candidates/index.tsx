import { createFileRoute } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/candidates/")({
  component: Candidates,
});

function Candidates() {
  const handleAddCandidate = () => {
    // TODO: Implement candidate creation
    console.log("Add new candidate");
  };

  // TODO: Replace with actual candidates data from Convex
  const candidates: any[] = [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-end">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add new candidate
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            {candidates.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No candidates yet"
                description="Start building your talent pipeline by adding candidates to track and manage."
                actionLabel="Add first candidate"
                onAction={handleAddCandidate}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* TODO: Map candidates when data is available */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
