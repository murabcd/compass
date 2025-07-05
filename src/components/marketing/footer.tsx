import { Icons } from "@/components/icons";

export const Footer = () => {
	return (
		<footer className="w-full bg-muted dark:bg-[#1F1F1F]">
			<div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
				<div className="flex items-center space-x-2">
					<Icons.compass className="size-6" />
					<span className="text-sm text-muted-foreground">
						The source code is available on{" "}
						<a
							href="https://github.com/murabcd/compass"
							className="underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							GitHub
						</a>
						.
					</span>
				</div>
			</div>
		</footer>
	);
};
