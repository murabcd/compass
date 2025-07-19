import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { AlertCircle, Bot } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/intro/$assistantId")({
	// Ensure we always treat the param as the proper Convex Id type
	parseParams: (p) => ({ assistantId: p.assistantId as Id<"assistants"> }),
	component: IntroForm,
});

function IntroForm() {
	const navigate = useNavigate();
	const { assistantId } = Route.useParams();
	const [showDisclaimer, setShowDisclaimer] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
	});

	const {
		data: assistant,
		isLoading,
		error,
	} = useQuery(
		convexQuery(api.assistants.getAssistant, {
			id: assistantId as Id<"assistants">,
		}),
	);

	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		phone?: string;
	}>({});

	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		// Clear the error for this field when user types
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleNext = () => {
		const newErrors: { name?: string; email?: string; phone?: string } = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		} else if (formData.name.trim().length < 2) {
			newErrors.name = "Name must be at least 2 characters";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
			newErrors.email = "Enter a valid email";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "Phone is required";
		} else if (!/^\+?[0-9 ()-]{6,}$/.test(formData.phone.trim())) {
			newErrors.phone = "Enter a valid phone number";
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			return; // validation failed
		}

		// Store the data (you might want to send this to your backend)
		localStorage.setItem("candidateInfo", JSON.stringify(formData));

		// Show disclaimer instead of redirecting immediately
		setShowDisclaimer(true);
	};

	const handleProceedToInterview = () => {
		// Redirect to interview with the actual assistantId
		navigate({
			to: "/interview/$assistantId",
			params: { assistantId },
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<p className="text-muted-foreground">Loading interview…</p>
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

	if (showDisclaimer) {
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
							<div className="space-y-4">
								<h2 className="text-sm text-start font-medium text-foreground">
									Important notice
								</h2>

								<div className="space-y-3 text-left">
									<p className="text-sm text-muted-foreground leading-relaxed">
										Please note that this interview will be with an AI
										interviewer. You will answer each question by speaking out
										loud, so find a quiet spot and make sure your internet
										connection is stable.
									</p>
								</div>
							</div>

							<div className="flex justify-start">
								<Button
									onClick={handleProceedToInterview}
									size="default"
									className="mt-6 cursor-pointer"
								>
									I understand, proceed to interview
								</Button>
							</div>
						</div>
					</div>
				</div>
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
						<div className="space-y-4">
							<h2 className="text-sm text-start font-medium text-foreground">
								Please provide your details
							</h2>

							<div className="space-y-4">
								<div>
									<Label htmlFor="name" className="text-sm text-foreground">
										What's your name?
									</Label>
									<Input
										id="name"
										type="text"
										placeholder="Enter your full name"
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										className={`mt-1 ${errors.name ? "border-destructive" : ""}`}
										aria-invalid={Boolean(errors.name)}
									/>
									{errors.name && (
										<p className="mt-1 text-destructive text-xs">
											{errors.name}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="email" className="text-sm text-foreground">
										What's your email?
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email address"
										value={formData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
										className={`mt-1 ${errors.email ? "border-destructive" : ""}`}
										aria-invalid={Boolean(errors.email)}
									/>
									{errors.email && (
										<p className="mt-1 text-destructive text-xs">
											{errors.email}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="phone" className="text-sm text-foreground">
										What's your phone number?
									</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="Enter your phone number"
										value={formData.phone}
										onChange={(e) => handleInputChange("phone", e.target.value)}
										className={`mt-1 ${errors.phone ? "border-destructive" : ""}`}
										aria-invalid={Boolean(errors.phone)}
									/>
									{errors.phone && (
										<p className="mt-1 text-destructive text-xs">
											{errors.phone}
										</p>
									)}
								</div>
							</div>
						</div>

						<div className="flex justify-start">
							<Button
								onClick={handleNext}
								size="default"
								className="mt-6 cursor-pointer"
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
