import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
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
