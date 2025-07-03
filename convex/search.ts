import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getTalent = query({
  args: {
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    if (args.search) {
      const results = await ctx.db
        .query("talent")
        .withSearchIndex("by_description_title_and_skills", (q) =>
          q.search("description", args.search as string)
        )
        .paginate(args.paginationOpts);
      return results;
    }
    return await ctx.db.query("talent").order("desc").paginate(args.paginationOpts);
  },
});
