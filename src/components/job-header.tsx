import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
	Calendar,
	ChevronDown,
	MousePointerClick,
	Phone,
	Plus,
	User,
} from "lucide-react";
import { useState } from "react";
import { AssistantSelectDialog } from "@/components/assistant-select-dialog";
import { InterviewCreateDialog } from "@/components/interview-create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
	isActive?: boolean;
	assistantId?: Id<"assistants">;
	_creationTime: number;
}

interface JobHeaderProps {
	job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
	const [showAssistantSelect, setShowAssistantSelect] = useState(false);
	const [showInterviewCreate, setShowInterviewCreate] = useState(false);

	const assignAssistant = useMutation(api.jobs.assignAssistantToJob);
	const currentAssistant = useQuery(
		api.assistants.getAssistant,
		job.assistantId ? { id: job.assistantId } : "skip",
	);

	const formatDate = (timestamp: number) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(new Date(timestamp));
	};

	const handleAssistantSelected = async (assistantId: Id<"assistants">) => {
		try {
			await assignAssistant({ jobId: job._id, assistantId });
			setShowAssistantSelect(false);
		} catch (error) {
			console.error("Failed to assign assistant:", error);
		}
	};

	return (
		<div className="px-4 lg:px-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl font-bold">{job.title}</h1>
						<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								<span>Created On: {formatDate(job._creationTime)}</span>
							</div>
							<div className="flex items-center gap-1">
								<User className="h-4 w-4" />
								<span>Owner: Murad Abdullakadyrov</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{currentAssistant && (
							<Badge
								variant="secondary"
								className="bg-green-100 text-green-800"
							>
								{currentAssistant.name}
							</Badge>
						)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 cursor-pointer">
									<Phone className="h-4 w-4" />
									Define AI interview
									<ChevronDown className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuItem
									className="gap-2"
									onClick={() => setShowInterviewCreate(true)}
								>
									<Plus className="h-4 w-4" />
									Create a new interview
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onClick={() => setShowAssistantSelect(true)}
								>
									<MousePointerClick className="h-4 w-4" />
									Choose from existing
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Job Details */}
				<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
					<Badge variant="outline">{job.location}</Badge>
					<Badge variant="outline">{job.employmentType}</Badge>
					<Badge variant="outline">{job.seniorityLevel}</Badge>
					<Badge variant="outline">
						{job.hiresNeeded} hire{job.hiresNeeded > 1 ? "s" : ""} needed
					</Badge>
					<Badge variant="outline">
						${job.salaryMin.toLocaleString()} - $
						{job.salaryMax.toLocaleString()}/month
					</Badge>
				</div>

				{/* Skills */}
				<div className="flex flex-wrap gap-2">
					{job.skills.map((skill) => (
						<Badge key={skill} variant="secondary">
							{skill}
						</Badge>
					))}
				</div>
			</div>

			{/* Modal dialogs */}
			<AssistantSelectDialog
				open={showAssistantSelect}
				onOpenChange={setShowAssistantSelect}
				onSelected={handleAssistantSelected}
				currentAssistantId={job.assistantId}
			/>
			<InterviewCreateDialog
				open={showInterviewCreate}
				onOpenChange={setShowInterviewCreate}
				defaultAssistantId={job.assistantId}
			/>
		</div>
	);
}
