import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateAttachmentUrl = mutation({
	args: {
		contentType: v.string(),
	},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});
