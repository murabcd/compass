import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTalent = query({
	args: {
		talent: v.optional(v.string()),
		country: v.optional(v.string()),
		minExperience: v.optional(v.number()),
		maxExperience: v.optional(v.number()),
		minSalary: v.optional(v.number()),
		maxSalary: v.optional(v.number()),
		sortBy: v.optional(
			v.union(v.literal("salary-asc"), v.literal("salary-desc")),
		),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		let query = ctx.db.query("talent");

		if (args.talent) {
			query = query.withSearchIndex("by_description_title_and_skills", (q) =>
				q.search("description", args.talent as string),
			);
		} else {
			query = query.order("desc");
		}

		let results = await query.paginate(args.paginationOpts);

		// Apply filters on the results
		if (
			args.country ||
			args.minExperience !== undefined ||
			args.maxExperience !== undefined ||
			args.minSalary !== undefined ||
			args.maxSalary !== undefined
		) {
			const filteredPage = results.page.filter((talent) => {
				if (args.country && talent.country !== args.country) return false;
				if (
					args.minExperience !== undefined &&
					talent.experience < args.minExperience
				)
					return false;
				if (
					args.maxExperience !== undefined &&
					talent.experience > args.maxExperience
				)
					return false;
				if (args.minSalary !== undefined && talent.salaryMonth < args.minSalary)
					return false;
				if (args.maxSalary !== undefined && talent.salaryMonth > args.maxSalary)
					return false;
				return true;
			});
			results = { ...results, page: filteredPage };
		}

		// Apply sorting
		if (args.sortBy) {
			const sortedPage = [...results.page].sort((a, b) => {
				if (args.sortBy === "salary-asc") {
					return a.salaryMonth - b.salaryMonth;
				} else if (args.sortBy === "salary-desc") {
					return b.salaryMonth - a.salaryMonth;
				}
				return 0;
			});
			results = { ...results, page: sortedPage };
		}

		return results;
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
