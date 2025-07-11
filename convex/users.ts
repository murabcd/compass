import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

import type { Doc } from "./_generated/dataModel";

export const getUser = query({
	args: {},
	handler: async (ctx): Promise<Doc<"users"> | null> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return null;
		}
		return await ctx.db.get(userId);
	},
});

export const deleteCurrentUser = mutation({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("User not authenticated");
		}

		await ctx.db.delete(userId);

		return { success: true };
	},
});

export const updateAccountDetails = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		avatarStorageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("User not authenticated");
		}

		let avatarUrlToStore: string | undefined;

		if (args.avatarStorageId) {
			const urlFromResult = await ctx.storage.getUrl(args.avatarStorageId);
			if (urlFromResult) {
				avatarUrlToStore = urlFromResult;
			} else {
				console.warn(
					`Could not get URL for storageId: ${args.avatarStorageId}. Avatar URL will not be updated.`,
				);
				avatarUrlToStore = undefined;
			}
		}

		await ctx.db.patch(userId, {
			name: args.name,
			email: args.email,
			...(args.avatarStorageId !== undefined && {
				avatarStorageId: args.avatarStorageId,
			}),
			avatarUrl: args.avatarStorageId ? avatarUrlToStore : undefined,
		});

		return { success: true };
	},
});
