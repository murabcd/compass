import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
});

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2">
				<div className="flex flex-col items-center gap-2 font-medium">
					<div className="flex size-6 items-center justify-center rounded-md">
						<Icons.compass />
					</div>
				</div>
				<h1 className="text-2xl font-bold">Forgot password</h1>
				<p className="text-center text-sm">
					Enter your email to get a password reset link.
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
					<Button type="submit" className="w-full cursor-pointer">
						Send code
					</Button>
				</form>
			</Form>
			<div className="text-center text-sm">
				<Link to="/login" className="underline">
					Back to Log in
				</Link>
			</div>
		</div>
	);
}
