import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";

import { ChevronRight, Heart, Search, Users, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { TalentCard, TalentCardSkeleton } from "@/components/talent-card";
import { TalentFilters } from "@/components/talent-filters";
import { TalentSort } from "@/components/talent-sort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/talent/")({
	component: Talent,
});

interface FilterOptions {
	country?: string;
	minExperience?: number;
	maxExperience?: number;
	minSalary?: number;
	maxSalary?: number;
}

type SortOption = "salary-asc" | "salary-desc" | undefined;

function Talent() {
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<FilterOptions>({});
	const [sortBy, setSortBy] = useState<SortOption>();

	const { data: talentResult, isLoading } = useQuery(
		convexQuery(api.talents.getTalent, {
			talent: search || undefined,
			country: filters.country,
			minExperience: filters.minExperience,
			maxExperience: filters.maxExperience,
			minSalary: filters.minSalary,
			maxSalary: filters.maxSalary,
			sortBy,
			paginationOpts: { numItems: 10, cursor: null },
		}),
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const handleReset = () => {
		setSearch("");
		setFilters({});
		setSortBy(undefined);
	};

	const talent = talentResult?.page || [];
	
	const hasActiveFiltersOrSort = Object.values(filters).some(value => value !== undefined) || sortBy !== undefined || search !== "";

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="px-4 lg:px-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							<Input
								placeholder="ex: react native developer with 4 years of experience and a passion for startups."
								className="w-full pl-10 pr-4 py-2 text-base rounded-full"
								value={search}
								onChange={handleSearchChange}
							/>
						</div>
						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center gap-2">
								<TalentFilters filters={filters} onFiltersChange={setFilters} />
								<TalentSort sortBy={sortBy} onSortChange={setSortBy} />
								{hasActiveFiltersOrSort && (
									<Button variant="ghost" onClick={handleReset} className="gap-2">
										<span>Reset</span>
										<X className="w-4 h-4" />
									</Button>
								)}
							</div>
							<Button variant="ghost" className="gap-2">
								<Heart className="w-4 h-4" />
								<span>View favorites</span>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>

					<div className="px-4 lg:px-6">
						<div className="flex flex-col gap-3">
							{isLoading &&
								Array.from({ length: 5 }, (_, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <The list of skeletons is static, so using the index as a key is safe here.>
									<TalentCardSkeleton key={`talent-skeleton-${i}`} />
								))}

							{!isLoading && talent.length === 0 && (
								<EmptyState
									icon={Users}
									title="No results found"
									description="Try adjusting your search or filters to find what you're looking for."
									actionLabel="Clear search"
									onAction={() => setSearch("")}
								/>
							)}

							{talent.map((t) => (
								<TalentCard key={t._id} talent={t} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
