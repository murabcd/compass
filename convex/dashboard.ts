import { v } from "convex/values";
import { query } from "./_generated/server";

export const getDashboardMetrics = query({
  args: {},
  returns: v.object({
    openPositions: v.number(),
    activeCandidates: v.number(),
    averageTimeToHire: v.number(),
    interviewSuccessRate: v.number(),
  }),
  handler: async (ctx) => {
    // Get total number of open positions (jobs)
    const jobs = await ctx.db.query("jobs").collect();
    const openPositions = jobs.length;

    // Get total number of active candidates
    const candidates = await ctx.db.query("candidates").collect();
    const activeCandidates = candidates.length;

    // Calculate average time to hire - placeholder value for now
    // TODO: Implement real calculation based on hire dates vs application dates
    const averageTimeToHire = 0;

    // Calculate interview success rate
    const interviewedCandidates = candidates.filter(
      (c) => c.status === "shortlisted"
    ).length;
    const interviewSuccessRate =
      activeCandidates > 0
        ? Math.round((interviewedCandidates / activeCandidates) * 100)
        : 0;

    return {
      openPositions,
      activeCandidates,
      averageTimeToHire,
      interviewSuccessRate,
    };
  },
});

export const getChartData = query({
  args: {},
  returns: v.array(
    v.object({
      date: v.string(),
      applications: v.number(),
      interviews: v.number(),
    })
  ),
  handler: async (ctx) => {
    // Return empty array for now - no hardcoded data
    return [];
  },
});
