import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { JobCard } from "@/components/job-card";
import { Loader } from "@/components/loader";
import { EmptyState } from "@/components/empty-state";
import { JobCreateDialog } from "@/components/job-create-dialog";
import { Id } from "../../../convex/_generated/dataModel";

export const Route = createFileRoute("/jobs/")({
  component: Jobs,
});

interface Job {
  _id: Id<"jobs">;
  title: string;
  company: string;
  location: string;
  salary: number;
  description: string;
  _creationTime: number;
}

function Jobs() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const { data: jobs, isLoading } = useQuery(convexQuery(api.jobs.getJobs, {}));

  const handleCreateJob = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
  };

  if (isLoading || jobs === undefined) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="flex items-center justify-end">
                <Button
                  onClick={handleCreateJob}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Add new job
                </Button>
              </div>
            </div>
            <div className="px-4 lg:px-6 flex-1">
              <div className="flex items-center justify-center h-full min-h-[60vh]">
                <Loader size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="flex items-center justify-end">
                <Button
                  onClick={handleCreateJob}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Add new job
                </Button>
              </div>
            </div>

            <div className="px-4 lg:px-6">
              {jobs.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No jobs posted yet"
                  description="Get started by creating your first job posting to attract top talent."
                  actionLabel="Create first job"
                  onAction={handleCreateJob}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} onEdit={() => handleEditJob(job)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <JobCreateDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      <JobCreateDialog
        open={!!editingJob}
        onOpenChange={(open) => !open && setEditingJob(null)}
        job={editingJob || undefined}
      />
    </>
  );
}
