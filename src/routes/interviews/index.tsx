import { createFileRoute } from "@tanstack/react-router";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/interviews/")({
  component: Interviews,
});

function Interviews() {
  const handleScheduleInterview = () => {
    // TODO: Implement interview scheduling
    console.log("Schedule new interview");
  };

  // TODO: Replace with actual interviews data from Convex
  const interviews: any[] = [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-end">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Schedule interview
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            {interviews.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No interviews scheduled"
                description="Schedule interviews with candidates to evaluate their fit for your open positions."
                actionLabel="Schedule first interview"
                onAction={handleScheduleInterview}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* TODO: Map interviews when data is available */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
