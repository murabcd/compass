import { Filter, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FilterOptions {
	country?: string;
	minExperience?: number;
	maxExperience?: number;
	minSalary?: number;
	maxSalary?: number;
}

interface TalentFiltersProps {
	filters: FilterOptions;
	onFiltersChange: (filters: FilterOptions) => void;
}

export function TalentFilters({
	filters,
	onFiltersChange,
}: TalentFiltersProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleClearFilters = () => {
		onFiltersChange({});
	};

	const handleCountryChange = (value: string) => {
		onFiltersChange({
			...filters,
			country: value === "all" ? undefined : value,
		});
	};

	const handleExperienceChange = (min: string, max: string) => {
		onFiltersChange({
			...filters,
			minExperience: min ? Number(min) : undefined,
			maxExperience: max ? Number(max) : undefined,
		});
	};

	const handleSalaryChange = (min: string, max: string) => {
		onFiltersChange({
			...filters,
			minSalary: min ? Number(min) : undefined,
			maxSalary: max ? Number(max) : undefined,
		});
	};

	const hasActiveFilters = Object.values(filters).some(
		(value) => value !== undefined,
	);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="gap-2 cursor-pointer">
					<Filter className="w-4 h-4" />
					<span>Filters</span>
					{hasActiveFilters && (
						<span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
							{Object.values(filters).filter((v) => v !== undefined).length}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="start">
				<div className="space-y-4">
					<div className="space-y-4">
						{/* Country Filter */}
						<div className="space-y-2">
							<Label htmlFor="country">Country</Label>
							<Select
								value={filters.country || "all"}
								onValueChange={handleCountryChange}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select country" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Countries</SelectItem>
									<SelectItem value="United States">United States</SelectItem>
									<SelectItem value="Canada">Canada</SelectItem>
									<SelectItem value="United Kingdom">United Kingdom</SelectItem>
									<SelectItem value="Germany">Germany</SelectItem>
									<SelectItem value="France">France</SelectItem>
									<SelectItem value="Netherlands">Netherlands</SelectItem>
									<SelectItem value="Spain">Spain</SelectItem>
									<SelectItem value="Italy">Italy</SelectItem>
									<SelectItem value="Poland">Poland</SelectItem>
									<SelectItem value="Ukraine">Ukraine</SelectItem>
									<SelectItem value="India">India</SelectItem>
									<SelectItem value="Brazil">Brazil</SelectItem>
									<SelectItem value="Argentina">Argentina</SelectItem>
									<SelectItem value="Mexico">Mexico</SelectItem>
									<SelectItem value="Australia">Australia</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Experience Filter */}
						<div className="space-y-2">
							<Label htmlFor="experience">Years of experience</Label>
							<div className="flex gap-2">
								<div className="flex-1">
									<Input
										type="number"
										placeholder="Min"
										value={filters.minExperience || ""}
										onChange={(e) =>
											handleExperienceChange(
												e.target.value,
												String(filters.maxExperience || ""),
											)
										}
									/>
								</div>
								<div className="flex-1">
									<Input
										type="number"
										placeholder="Max"
										value={filters.maxExperience || ""}
										onChange={(e) =>
											handleExperienceChange(
												String(filters.minExperience || ""),
												e.target.value,
											)
										}
									/>
								</div>
							</div>
						</div>

						{/* Salary Filter */}
						<div className="space-y-2">
							<Label htmlFor="salary">Monthly salary ($)</Label>
							<div className="flex gap-2">
								<div className="flex-1">
									<Input
										type="number"
										placeholder="Min"
										value={filters.minSalary || ""}
										onChange={(e) =>
											handleSalaryChange(
												e.target.value,
												String(filters.maxSalary || ""),
											)
										}
									/>
								</div>
								<div className="flex-1">
									<Input
										type="number"
										placeholder="Max"
										value={filters.maxSalary || ""}
										onChange={(e) =>
											handleSalaryChange(
												String(filters.minSalary || ""),
												e.target.value,
											)
										}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Clear Filters Button */}
					{hasActiveFilters && (
						<Button
							variant="ghost"
							onClick={handleClearFilters}
							className="w-full"
						>
							Clear filters
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
