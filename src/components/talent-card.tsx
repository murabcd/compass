import type React from "react";
import { Link } from "@tanstack/react-router";

import {
	MoreHorizontal,
	CheckCircle,
	XCircle,
	MapPin,
	Briefcase,
	DollarSign,
	Heart,
	EyeOff,
	User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Id } from "convex/_generated/dataModel";

interface Talent {
	_id: Id<"talent">;
	name: string;
	initials: string;
	image: string;
	title: string;
	experience: number;
	country: string;
	vettedSkills: string[];
	description: string;
	salaryMonth: number;
	isVerified: boolean;
	isNotRecommended: boolean;
}

interface TalentCardProps {
	talent: Talent;
}

export function TalentCard({ talent }: TalentCardProps) {
	const formatSalary = (num: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(num);
	};

	const handleDropdownClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<div className="relative">
			<Link to="/talent/$talentId" params={{ talentId: talent._id }}>
				<div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card hover:shadow-sm transition-all cursor-pointer group">
					<div className="flex-1 min-w-0 space-y-3">
						{/* Header */}
						<div className="flex items-center gap-2">
							<h3 className="text-base font-semibold truncate">
								{talent.name}
							</h3>
							{talent.isVerified && (
								<CheckCircle className="w-4 h-4 text-green-500" />
							)}
							{talent.isNotRecommended && (
								<XCircle className="w-4 h-4 text-red-500" />
							)}
						</div>

						{/* Main content */}
						<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<User className="h-3 w-3" />
								<span>{talent.title}</span>
							</div>
							<div className="flex items-center gap-1">
								<Briefcase className="h-3 w-3" />
								<span>{talent.experience} years</span>
							</div>
							<div className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								<span>{talent.country}</span>
							</div>
							<div className="flex items-center gap-1">
								<DollarSign className="h-3 w-3" />
								<span>{formatSalary(talent.salaryMonth)}/month</span>
							</div>
						</div>
					</div>

					<div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
						<DropdownMenu>
							<DropdownMenuTrigger asChild onClick={handleDropdownClick}>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 hover:bg-muted"
								>
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">Open menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" onClick={handleDropdownClick}>
								<DropdownMenuItem>
									<Heart className="mr-2 h-4 w-4" />
									Add to favorites
								</DropdownMenuItem>
								<DropdownMenuItem>
									<EyeOff className="mr-2 h-4 w-4" />
									Not a fit
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</Link>
		</div>
	);
}

export function TalentCardSkeleton() {
	return (
		<div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-card dark:bg-card">
			<div className="flex-1 min-w-0 space-y-3">
				{/* Header */}
				<div className="flex items-start justify-between">
					<Skeleton className="h-5 w-48" />
				</div>

				{/* Main content */}
				<div className="flex flex-wrap items-center gap-2">
					{/* Skills */}
					<div className="flex flex-wrap items-center gap-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-14" />
					</div>

					{/* Job details */}
					<div className="flex flex-wrap items-center gap-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-28" />
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="ml-4">
				<Skeleton className="h-8 w-8 rounded" />
			</div>
		</div>
	);
}
