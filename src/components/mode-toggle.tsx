import { Moon, Sun } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenuItem
			className="cursor-pointer"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<div className="flex items-center gap-2">
				{theme === "light" ? (
					<Moon className="h-4 w-4" />
				) : (
					<Sun className="h-4 w-4" />
				)}
				<span>{theme === "light" ? "Dark" : "Light"} mode</span>
			</div>
		</DropdownMenuItem>
	);
}
