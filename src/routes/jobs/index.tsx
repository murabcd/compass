import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard, JobCardSkeleton } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { JobCreateDialog } from "@/components/job-create-dialog";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
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
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
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

            {jobs.length === 0 ? (
              <div className="px-4 lg:px-6">
                <EmptyState
                  icon={Briefcase}
                  title="No jobs posted yet"
                  description="Get started by creating your first job posting to attract top talent."
                  actionLabel="Create first job"
                  onAction={handleCreateJob}
                />
              </div>
            ) : (
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} onEdit={() => handleEditJob(job)} />
                ))}
              </div>
            )}
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
