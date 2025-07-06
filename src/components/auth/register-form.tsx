import { Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useAuthActions } from "@convex-dev/auth/react";

const formSchema = z.object({
	firstName: z.string().min(1, {
		message: "First name is required.",
	}),
	lastName: z.string().min(1, {
		message: "Last name is required.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { signIn } = useAuthActions();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col items-center gap-2">
							<div className="flex flex-col items-center gap-2 font-medium">
								<div className="flex size-6 items-center justify-center rounded-md">
									<Icons.compass />
								</div>
								<span className="sr-only">Compass</span>
							</div>
							<h1 className="text-2xl font-bold">Create an account</h1>
							<div className="text-center text-sm">
								Already have an account?{" "}
								<Link to="/login" className="underline underline-offset-4">
									Login
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-6">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First name</FormLabel>
											<FormControl>
												<Input placeholder="Max" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last name</FormLabel>
											<FormControl>
												<Input placeholder="Robinson" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Enter your email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Create an account
							</Button>
						</div>
						<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-background text-muted-foreground relative z-10 px-2">
								OR CONTINUE WITH
							</span>
						</div>
						<div className="grid gap-4">
							<Button
								variant="outline"
								type="button"
								className="w-full cursor-pointer"
								onClick={() => void signIn("google", { redirectTo: "/talent" })}
							>
								<Icons.google />
								Continue with Google
							</Button>
						</div>
					</div>
				</form>
			</Form>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our{" "}
				<span className="underline cursor-pointer">Terms of Service</span> and{" "}
				<span className="underline cursor-pointer">Privacy Policy</span>.
			</div>
		</div>
	);
}
