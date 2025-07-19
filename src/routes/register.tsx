import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";

import { RegisterForm } from "@/components/auth/register-form";

export const Route = createFileRoute("/register")({
	component: Register,
});

function Register() {
	const { isLoading, isAuthenticated } = useConvexAuth();
	const navigate = useNavigate();

	// If the user is already authenticated, redirect them to the app
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			void navigate({ to: "/talent", replace: true });
		}
	}, [isLoading, isAuthenticated, navigate]);

	if (!isLoading && isAuthenticated) {
		// Avoid flashing the register form before redirect occurs
		return null;
	}

	return (
		<div className="w-full h-screen flex items-start justify-center p-4 relative pt-52">
			<div className="w-full max-w-md">
				<RegisterForm />
			</div>
		</div>
	);
}
