import { useAuthActions } from "@convex-dev/auth/react";

import { useRouter } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import * as React from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function DataControlsSettings() {
	const [showDeleteAccountDialog, setShowDeleteAccountDialog] =
		React.useState(false);

	const deleteAccountMutation = useMutation(api.users.deleteCurrentUser);
	const { signOut } = useAuthActions();
	const router = useRouter();

	const handleDeleteAccount = async () => {
		toast.promise(deleteAccountMutation({}), {
			loading: "Deleting account...",
			success: () => {
				setShowDeleteAccountDialog(false);
				void signOut();
				void router.navigate({ to: "/" });
				return "Account deleted";
			},
			error: (err) => {
				setShowDeleteAccountDialog(false);
				return `Failed to delete account: ${err.message || "Unknown error"}`;
			},
		});
	};

	return (
		<div className="flex flex-col gap-4 pt-4 px-3">
			<div className="flex items-center justify-between gap-4">
				<Label className="text-sm">Delete account</Label>
				<AlertDialog
					open={showDeleteAccountDialog}
					onOpenChange={setShowDeleteAccountDialog}
				>
					<AlertDialogTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="text-destructive hover:text-destructive focus:text-destructive dark:text-red-500"
						>
							Delete
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and all associated data.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="cursor-pointer">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteAccount}
								className="bg-destructive hover:bg-destructive/90 cursor-pointer"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
