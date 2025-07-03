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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface Job {
  _id: Id<"jobs">;
  title: string;
  skills: string[];
  hiresNeeded: number;
  location: "remote" | "hybrid" | "on-site";
  employmentType: "full-time" | "part-time";
  seniorityLevel:
    | "internship"
    | "entry-level"
    | "associate"
    | "mid-senior-level"
    | "director"
    | "executive"
    | "not-applicable";
  salaryMin: number;
  salaryMax: number;
}

interface JobCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job; // Optional job for editing
}

export function JobCreateDialog({ open, onOpenChange, job }: JobCreateDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    skills: [] as string[],
    skillInput: "",
    hiresNeeded: "",
    location: "" as "remote" | "hybrid" | "on-site" | "",
    employmentType: "" as "full-time" | "part-time" | "",
    seniorityLevel: "" as
      | "internship"
      | "entry-level"
      | "associate"
      | "mid-senior-level"
      | "director"
      | "executive"
      | "not-applicable"
      | "",
    salaryMin: "",
    salaryMax: "",
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
        skills: job.skills,
        skillInput: "",
        hiresNeeded: job.hiresNeeded.toString(),
        location: job.location,
        employmentType: job.employmentType,
        seniorityLevel: job.seniorityLevel,
        salaryMin: job.salaryMin.toString(),
        salaryMax: job.salaryMax.toString(),
      });
    } else {
      setFormData({
        title: "",
        skills: [],
        skillInput: "",
        hiresNeeded: "",
        location: "",
        employmentType: "",
        seniorityLevel: "",
        salaryMin: "",
        salaryMax: "",
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      formData.skills.length === 0 ||
      !formData.hiresNeeded ||
      !formData.location ||
      !formData.employmentType ||
      !formData.seniorityLevel ||
      !formData.salaryMin ||
      !formData.salaryMax
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const hiresNeeded = parseInt(formData.hiresNeeded);
    const salaryMin = parseInt(formData.salaryMin);
    const salaryMax = parseInt(formData.salaryMax);

    if (isNaN(hiresNeeded) || hiresNeeded <= 0) {
      toast.error("Please enter a valid number of hires needed");
      return;
    }

    if (isNaN(salaryMin) || salaryMin <= 0) {
      toast.error("Please enter a valid minimum salary");
      return;
    }

    if (isNaN(salaryMax) || salaryMax <= 0) {
      toast.error("Please enter a valid maximum salary");
      return;
    }

    if (salaryMax <= salaryMin) {
      toast.error("Maximum salary must be greater than minimum salary");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateJob({
          id: job._id,
          title: formData.title,
          skills: formData.skills,
          hiresNeeded: hiresNeeded,
          location: formData.location as "remote" | "hybrid" | "on-site",
          employmentType: formData.employmentType as "full-time" | "part-time",
          seniorityLevel: formData.seniorityLevel as
            | "internship"
            | "entry-level"
            | "associate"
            | "mid-senior-level"
            | "director"
            | "executive"
            | "not-applicable",
          salaryMin: salaryMin,
          salaryMax: salaryMax,
        });
        toast.success("Job updated successfully!");
      } else {
        await createJob({
          title: formData.title,
          skills: formData.skills,
          hiresNeeded: hiresNeeded,
          location: formData.location as "remote" | "hybrid" | "on-site",
          employmentType: formData.employmentType as "full-time" | "part-time",
          seniorityLevel: formData.seniorityLevel as
            | "internship"
            | "entry-level"
            | "associate"
            | "mid-senior-level"
            | "director"
            | "executive"
            | "not-applicable",
          salaryMin: salaryMin,
          salaryMax: salaryMax,
        });
        toast.success("Job created successfully!");
      }

      onOpenChange(false);
      setFormData({
        title: "",
        skills: [],
        skillInput: "",
        hiresNeeded: "",
        location: "",
        employmentType: "",
        seniorityLevel: "",
        salaryMin: "",
        salaryMax: "",
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

  const addSkill = () => {
    if (
      formData.skillInput.trim() &&
      !formData.skills.includes(formData.skillInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.skillInput.trim()],
        skillInput: "",
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const locationOptions = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "on-site", label: "On-site" },
  ];

  const employmentTypeOptions = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
  ];

  const seniorityLevelOptions = [
    { value: "internship", label: "Internship" },
    { value: "entry-level", label: "Entry level" },
    { value: "associate", label: "Associate" },
    { value: "mid-senior-level", label: "Mid-senior level" },
    { value: "director", label: "Director" },
    { value: "executive", label: "Executive" },
    { value: "not-applicable", label: "Not applicable" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                placeholder="e.g. Frontend Developer"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skills">What skills should they have?</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  value={formData.skillInput}
                  onChange={(e) => handleInputChange("skillInput", e.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                  placeholder="e.g. React"
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  Add
                </Button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center gap-1 max-w-[200px] break-words"
                    >
                      <span className="truncate flex-1 min-w-0">{skill}</span>
                      <X
                        className="h-3 w-3 cursor-pointer flex-shrink-0"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hiresNeeded">How many hires you need?</Label>
              <Input
                id="hiresNeeded"
                type="number"
                value={formData.hiresNeeded}
                onChange={(e) => handleInputChange("hiresNeeded", e.target.value)}
                placeholder="e.g. 2"
                min="1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Job location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleInputChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="employmentType">Employment type</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => handleInputChange("employmentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="seniorityLevel">Seniority level</Label>
              <Select
                value={formData.seniorityLevel}
                onValueChange={(value) => handleInputChange("seniorityLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seniority level" />
                </SelectTrigger>
                <SelectContent>
                  {seniorityLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>What should be the ideal monthly salary?</Label>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                    placeholder="e.g. 5000"
                    min="0"
                  />
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                    placeholder="e.g. 8000"
                    min="0"
                  />
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
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
