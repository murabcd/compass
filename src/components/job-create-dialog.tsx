import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Job {
  _id: Id<"jobs">;
  title: string;
  company: string;
  location: string;
  salary: number;
  description: string;
}

interface JobCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job; // Optional job for editing
}

export function JobCreateDialog({ open, onOpenChange, job }: JobCreateDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createJob = useMutation(api.jobs.createJob);
  const updateJob = useMutation(api.jobs.updateJob);

  const isEditing = !!job;

  // Pre-fill form when editing
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary.toString(),
        description: job.description,
      });
    } else {
      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.salary ||
      !formData.description
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const salary = parseInt(formData.salary);
    if (isNaN(salary) || salary <= 0) {
      toast.error("Please enter a valid salary amount");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateJob({
          id: job._id,
          title: formData.title,
          company: formData.company,
          location: formData.location,
          salary: salary,
          description: formData.description,
        });
        toast.success("Job updated successfully!");
      } else {
        await createJob({
          title: formData.title,
          company: formData.company,
          location: formData.location,
          salary: salary,
          description: formData.description,
        });
        toast.success("Job created successfully!");
      }

      onOpenChange(false);
      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} job. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit job" : "Create new job"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the job posting details below."
              : "Add a new job posting to attract top talent. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="e.g. TechCorp Inc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salary">Salary (USD)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                placeholder="e.g. 150000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the role, responsibilities, requirements..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
