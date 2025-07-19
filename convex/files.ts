import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateAttachmentUrl = mutation({
	args: {
		contentType: v.string(),
	},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});
