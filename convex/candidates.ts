import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCandidates = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("candidates"),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      resume: v.string(),
      coverLetter: v.string(),
      jobId: v.id("jobs"),
      status: v.union(
        v.literal("pending"),
        v.literal("shortlisted"),
        v.literal("rejected"),
        v.literal("hired")
      ),
      interviewDate: v.optional(v.number()),
      interviewer: v.optional(v.string()),
      jobTitle: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    const candidates = await ctx.db.query("candidates").collect();

    // Enrich candidates with job titles
    const enrichedCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const job = await ctx.db.get(candidate.jobId);
        return {
          ...candidate,
          jobTitle: job?.title,
        };
      })
    );

    return enrichedCandidates;
  },
});

export const getRecentCandidates = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("candidates"),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      jobId: v.id("jobs"),
      status: v.union(
        v.literal("pending"),
        v.literal("shortlisted"),
        v.literal("rejected"),
        v.literal("hired")
      ),
      jobTitle: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    const candidates = await ctx.db.query("candidates").order("desc").take(50);

    // Enrich candidates with job titles
    const enrichedCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const job = await ctx.db.get(candidate.jobId);
        return {
          ...candidate,
          jobTitle: job?.title,
        };
      })
    );

    return enrichedCandidates;
  },
});

export const getCandidatesByJob = query({
  args: {
    jobId: v.id("jobs"),
  },
  returns: v.array(
    v.object({
      _id: v.id("candidates"),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      resume: v.string(),
      coverLetter: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("shortlisted"),
        v.literal("rejected"),
        v.literal("hired")
      ),
      interviewDate: v.optional(v.number()),
      interviewer: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const candidates = await ctx.db
      .query("candidates")
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .collect();

    return candidates;
  },
});

export const createCandidate = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    resume: v.string(),
    coverLetter: v.string(),
    jobId: v.id("jobs"),
    status: v.optional(
      v.union(v.literal("pending"), v.literal("shortlisted"), v.literal("rejected"))
    ),
    interviewDate: v.optional(v.number()),
    interviewer: v.optional(v.string()),
  },
  returns: v.id("candidates"),
  handler: async (ctx, args) => {
    const candidate = await ctx.db.insert("candidates", {
      ...args,
      status: args.status || "pending",
    });
    return candidate;
  },
});

export const updateCandidate = mutation({
  args: {
    id: v.id("candidates"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    resume: v.optional(v.string()),
    coverLetter: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("pending"), v.literal("shortlisted"), v.literal("rejected"))
    ),
    interviewDate: v.optional(v.number()),
    interviewer: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    // Filter out undefined values
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, filteredUpdateData);
    return null;
  },
});

export const updateCandidateStatus = mutation({
  args: {
    id: v.id("candidates"),
    status: v.union(
      v.literal("pending"),
      v.literal("shortlisted"),
      v.literal("rejected")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return null;
  },
});

export const deleteCandidate = mutation({
  args: {
    id: v.id("candidates"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const scheduleInterview = mutation({
  args: {
    candidateId: v.id("candidates"),
    interviewDate: v.number(),
    interviewer: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.candidateId, {
      interviewDate: args.interviewDate,
      interviewer: args.interviewer,
      status: "shortlisted",
    });
    return null;
  },
});
