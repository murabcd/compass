import { useState, useMemo } from "react";
import { Copy, Mail, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import type { Id } from "convex/_generated/dataModel";

interface AssistantShareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	assistantId: Id<"assistants">;
	assistantName?: string;
}

export function AssistantShareDialog({
	open,
	onOpenChange,
	assistantId,
	assistantName = "Assistant",
}: AssistantShareDialogProps) {
	const [copied, setCopied] = useState(false);
	const [email, setEmail] = useState("");
	const [emailMessage, setEmailMessage] = useState("");
	const [emailError, setEmailError] = useState<string | undefined>(undefined);

	// Generate the share URL. Use a safe check for `window` so SSR doesn't break.
	// We deliberately send candidates to the intro form first, then they can
	// progress to the actual interview.  Memoise to avoid re-computing.
	const shareUrl = useMemo(() => {
		if (typeof window !== "undefined") {
			return `${window.location.origin}/intro/${assistantId}`;
		}
		// Fallback for SSR – the browser will prepend the correct origin.
		return `/intro/${assistantId}`;
	}, [assistantId]);

	const handleCopyLink = async () => {
		try {
			if (navigator?.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(shareUrl);
			} else {
				// Fallback for browsers that block Clipboard API (e.g. iOS Safari)
				const textarea = document.createElement("textarea");
				textarea.value = shareUrl;
				textarea.style.position = "fixed";
				textarea.style.left = "-9999px";
				document.body.appendChild(textarea);
				textarea.focus();
				textarea.select();
				document.execCommand("copy");
				document.body.removeChild(textarea);
			}

			setCopied(true);
			toast.success("Link copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error("Failed to copy link");
		}
	};

	const validateEmail = (val: string) => /^\S+@\S+\.\S+$/.test(val);

	const handleEmailChange = (val: string) => {
		setEmail(val);
		if (!val) {
			setEmailError("Email is required");
		} else if (!validateEmail(val)) {
			setEmailError("Enter a valid email");
		} else {
			setEmailError(undefined);
		}
	};

	const handleSendInvitation = () => {
		// Here you would typically integrate with your email service
		// For now, we'll just open the default email client
		const subject = `Invitation to AI Interview - ${assistantName}`;
		const body =
			emailMessage ||
			`
Hi there!

You've been invited to take an AI Interview for ${assistantName}.

This interview does not require preparation and is meant to assess your experience.
After you take this, our team will review the results and get back to you.

Note: You can take this interview from your phone or computer.

Start the AI Interview: ${shareUrl}

Best of luck!
		`.trim();

		const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		window.open(mailtoUrl);

		toast.success("Email client opened!");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-lg">
						Interview ready to share
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Share the link with candidates or invite them directly
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 pt-2">
					{/* Option 1: Copy Link */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">Interview link</Label>
						<div className="flex items-center gap-2">
							<Input
								value={shareUrl}
								className="text-muted-foreground"
								readOnly
							/>

							<Button
								variant="outline"
								size="sm"
								onClick={handleCopyLink}
								className="shrink-0"
							>
								{copied ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
								<span className="ml-1">{copied ? "Copied" : "Copy"}</span>
							</Button>
						</div>
					</div>

					{/* Option 2: Email Invitation */}
					<div className="space-y-4">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-medium">
									Invite by email
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter email address"
									value={email}
									onChange={(e) => handleEmailChange(e.target.value)}
									className={`w-full ${emailError ? "border-destructive" : ""}`}
									aria-invalid={Boolean(emailError)}
								/>
								{emailError && (
									<p className="mt-1 text-destructive text-xs">{emailError}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="message" className="text-sm font-medium">
									Email message
								</Label>
								<Textarea
									id="message"
									placeholder={`Hi {Candidate name},

The next step of your application at {Company name} is to take an AI Interview.

This interview does not require preparation and is meant to assess your experience.
After you take this, the {Company name} team will review the results and get back to you.

Note: You can take this interview from your phone or computer.

Start the AI Interview

Best of luck!`}
									value={emailMessage}
									onChange={(e) => setEmailMessage(e.target.value)}
									rows={10}
									className="max-h-[350px]"
								/>
							</div>
						</div>

						<Button
							onClick={handleSendInvitation}
							disabled={!email || Boolean(emailError)}
							className="w-full"
						>
							<Mail className="h-4 w-4" />
							Send Invitation
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
