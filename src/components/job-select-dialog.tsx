import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

interface JobSelectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	candidateId: Id<"candidates">;
	currentJobId: Id<"jobs">;
}

export function JobSelectDialog({
	open,
	onOpenChange,
	candidateId,
	currentJobId,
}: JobSelectDialogProps) {
	const [selectedJobId, setSelectedJobId] = useState<Id<"jobs"> | null>(null);
	const [isComboboxOpen, setIsComboboxOpen] = useState(false);
	const [isMoving, setIsMoving] = useState(false);

	const jobs = useQuery(api.jobs.getJobs);

	const moveCandidate = useMutation(api.candidates.moveToJob);

	const availableJobs = jobs?.filter((job) => job._id !== currentJobId) || [];

	const handleMoveCandidate = async () => {
		if (!selectedJobId) return;

		setIsMoving(true);
		try {
			await moveCandidate({
				candidateId,
				newJobId: selectedJobId,
			});
			toast.success("Candidate moved successfully!");
			onOpenChange(false);
			setSelectedJobId(null);
		} catch (error) {
			toast.error("Failed to move candidate. Please try again.");
		} finally {
			setIsMoving(false);
		}
	};

	const handleCancel = () => {
		onOpenChange(false);
		setSelectedJobId(null);
		setIsComboboxOpen(false);
	};

	const selectedJob = availableJobs.find((job) => job._id === selectedJobId);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Move candidate to another job</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">Select job</Label>
						<Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									aria-expanded={isComboboxOpen}
									className="w-full justify-between"
								>
									{selectedJob ? selectedJob.title : "Select job..."}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
								<Command>
									<CommandInput placeholder="Search jobs..." />
									<CommandList>
										<CommandEmpty>No jobs found.</CommandEmpty>
										<CommandGroup>
											{availableJobs.map((job) => (
												<CommandItem
													key={job._id}
													value={job.title}
													onSelect={() => {
														setSelectedJobId(job._id);
														setIsComboboxOpen(false);
													}}
													className="flex items-center p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
												>
													{job.title}
													<Check
														className={cn(
															"ml-auto h-4 w-4",
															selectedJobId === job._id
																? "opacity-100"
																: "opacity-0",
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={handleCancel}
						disabled={isMoving}
						className="cursor-pointer"
					>
						Cancel
					</Button>
					<Button
						onClick={handleMoveCandidate}
						disabled={!selectedJobId || isMoving}
						className="cursor-pointer"
					>
						{isMoving ? "Moving..." : "Move candidate"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
