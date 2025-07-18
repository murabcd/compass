import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = "salary-asc" | "salary-desc" | undefined;

interface TalentSortProps {
	sortBy: SortOption;
	onSortChange: (sortBy: SortOption) => void;
}

export function TalentSort({ sortBy, onSortChange }: TalentSortProps) {
	const getSortLabel = (option: SortOption) => {
		switch (option) {
			case "salary-asc":
				return "Price: Low to High";
			case "salary-desc":
				return "Price: High to Low";
			default:
				return "Sort by";
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="gap-2">
					<ListFilter className="w-4 h-4" />
					<span>{getSortLabel(sortBy)}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => onSortChange(undefined)}>
					Default
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onSortChange("salary-asc")}>
					Price: Low to High
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onSortChange("salary-desc")}>
					Price: High to Low
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
