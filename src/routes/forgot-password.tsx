import { createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPassword,
});

function ForgotPassword() {
	return (
		<div className="w-full h-screen flex items-start justify-center p-4 relative pt-52">
			<div className="w-full max-w-md">
				<ForgotPasswordForm />
			</div>
		</div>
	);
}
