import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useConvexAuth } from "convex/react";

import { LoginForm } from "@/components/auth/login-form";

export const Route = createFileRoute("/login")({
	component: Login,
});

function Login() {
	const { isLoading, isAuthenticated } = useConvexAuth();
	const navigate = useNavigate();

	// If the user is already authenticated, redirect them to the app
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			void navigate({ to: "/talent", replace: true });
		}
	}, [isLoading, isAuthenticated, navigate]);

	if (!isLoading && isAuthenticated) {
		// Avoid flashing the login form before redirect occurs
		return null;
	}

	return (
		<div className="w-full h-screen flex items-start justify-center p-4 relative pt-52">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
