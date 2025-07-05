import { createFileRoute } from "@tanstack/react-router";

import { RegisterForm } from "@/components/auth/register-form";

export const Route = createFileRoute("/register")({
	component: Register,
});

function Register() {
	return (
		<div className="w-full h-screen flex items-start justify-center p-4 relative pt-52">
			<div className="w-full max-w-md">
				<RegisterForm />
			</div>
		</div>
	);
}
