import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "@/components/auth/login-form";

export const Route = createFileRoute("/login")({
	component: Login,
});

function Login() {
	return (
		<div className="w-full h-screen flex items-start justify-center p-4 relative pt-52">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
