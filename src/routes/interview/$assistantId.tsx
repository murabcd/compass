import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { AlertCircle, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { Icons } from "@/components/icons";
import { InterviewAgent } from "@/components/interview-agent";
import { TranscriptProvider } from "@/components/transcript-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/interview/$assistantId")({
	parseParams: (p) => ({ assistantId: p.assistantId as Id<"assistants"> }),
	component: PublicInterview,
});

function PublicInterview() {
	const { assistantId } = Route.useParams();
	const [hasStarted, setHasStarted] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const navigate = useNavigate();

	const {
		data: assistant,
		isLoading,
		error,
	} = useQuery(
		convexQuery(api.assistants.getAssistant, {
			id: assistantId as Id<"assistants">,
		}),
	);

	// Check if user has filled out the intro form and redirect if needed
	useEffect(() => {
		const candidateInfo = localStorage.getItem("candidateInfo");
		if (!candidateInfo) {
			navigate({ to: "/intro/$assistantId", params: { assistantId } });
		}
	}, [assistantId, navigate]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<p className="text-muted-foreground">Preparing interview…</p>
			</div>
		);
	}

	if (error || !assistant) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<EmptyState
					icon={AlertCircle}
					title="Interview not found"
					description="The interview link you're trying to access is invalid or has expired."
					actionLabel="Go back"
					onAction={() => window.history.back()}
				/>
			</div>
		);
	}

	if (!assistant.isActive) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<EmptyState
					icon={Bot}
					title="Interview not available"
					description="This interview is currently not available. Please contact the organization for more information."
					actionLabel="Go back"
					onAction={() => window.history.back()}
				/>
			</div>
		);
	}

	if (hasStarted) {
		return (
			<div className="min-h-screen bg-background">
				<TranscriptProvider>
					<InterviewAgent assistantId={assistantId as Id<"assistants">} />
				</TranscriptProvider>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center relative">
			{/* Compass Icon in Center */}
			<div className="absolute inset-0 flex items-center justify-center">
				<Icons.compass className="w-24 h-24 text-muted-foreground/40" />
			</div>

			{/* Main Content */}
			<div className="w-full px-6 pr-12 flex items-center justify-end relative z-10">
				<div className="max-w-sm w-full">
					<div className="space-y-6">
						{/* Content */}
						<div className="space-y-4 text-center">
							<h2 className="text-sm text-start font-medium text-foreground">
								Before starting the interview
							</h2>

							<div className="space-y-3 text-left max-w-md mx-auto">
								<div className="flex gap-3">
									<p className="text-sm text-muted-foreground leading-relaxed">
										1. Please note that your AI interview recording will be
										available in your profile to review once completed.
									</p>
								</div>

								<div className="flex gap-3">
									<p className="text-sm text-muted-foreground leading-relaxed">
										2. This interview is proctored. Please stay on the same tab
										and don't use any external tools.
									</p>
								</div>

								<div className="flex gap-3">
									<p className="text-sm text-muted-foreground leading-relaxed">
										3. Feel free to ask clarifying questions throughout the
										interview.
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="terms"
									checked={agreedToTerms}
									onCheckedChange={(checked) =>
										setAgreedToTerms(checked === true)
									}
								/>
								<label
									htmlFor="terms"
									className="text-sm text-primary leading-relaxed cursor-pointer"
								>
									I agree to the terms & conditions of this interview
								</label>
							</div>

							<div className="flex justify-start">
								<Button
									onClick={() => setHasStarted(true)}
									size="default"
									className="mt-6 cursor-pointer"
									disabled={!agreedToTerms}
								>
									Start the interview
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
