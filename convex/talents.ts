import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getTalent = query({
	args: {
		talent: v.optional(v.string()),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		if (args.talent) {
			const results = await ctx.db
				.query("talent")
				.withSearchIndex("by_description_title_and_skills", (q) =>
					q.search("description", args.talent as string),
				)
				.paginate(args.paginationOpts);
			return results;
		}
		return await ctx.db
			.query("talent")
			.order("desc")
			.paginate(args.paginationOpts);
	},
});

export const getTalentById = query({
	args: {
		id: v.id("talent"),
	},
	returns: v.union(
		v.object({
			_id: v.id("talent"),
			_creationTime: v.number(),
			name: v.string(),
			initials: v.string(),
			image: v.string(),
			title: v.string(),
			experience: v.number(),
			country: v.string(),
			vettedSkills: v.array(v.string()),
			description: v.string(),
			salaryMonth: v.number(),
			isVerified: v.boolean(),
			isNotRecommended: v.boolean(),
		}),
		v.null(),
	),
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});
