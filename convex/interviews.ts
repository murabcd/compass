import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getInterviews = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("interviews"),
      _creationTime: v.number(),
      candidateId: v.id("candidates"),
      jobId: v.id("jobs"),
      interviewerId: v.optional(v.id("users")),
      scheduledDate: v.number(),
      duration: v.optional(v.number()),
      type: v.union(
        v.literal("phone"),
        v.literal("video"),
        v.literal("in-person"),
        v.literal("technical"),
        v.literal("final")
      ),
      status: v.union(
        v.literal("scheduled"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no-show")
      ),
      notes: v.optional(v.string()),
      score: v.optional(v.number()),
      feedback: v.optional(v.string()),
      nextSteps: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    const interviews = await ctx.db.query("interviews").collect();
    return interviews;
  },
});

export const getInterviewsByCandidate = query({
  args: {
    candidateId: v.id("candidates"),
  },
  returns: v.array(
    v.object({
      _id: v.id("interviews"),
      _creationTime: v.number(),
      jobId: v.id("jobs"),
      interviewerId: v.optional(v.id("users")),
      scheduledDate: v.number(),
      duration: v.optional(v.number()),
      type: v.union(
        v.literal("phone"),
        v.literal("video"),
        v.literal("in-person"),
        v.literal("technical"),
        v.literal("final")
      ),
      status: v.union(
        v.literal("scheduled"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no-show")
      ),
      notes: v.optional(v.string()),
      score: v.optional(v.number()),
      feedback: v.optional(v.string()),
      nextSteps: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();
    return interviews;
  },
});

export const getUpcomingInterviews = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("interviews"),
      _creationTime: v.number(),
      candidateId: v.id("candidates"),
      jobId: v.id("jobs"),
      interviewerId: v.optional(v.id("users")),
      scheduledDate: v.number(),
      type: v.union(
        v.literal("phone"),
        v.literal("video"),
        v.literal("in-person"),
        v.literal("technical"),
        v.literal("final")
      ),
      candidateName: v.optional(v.string()),
      jobTitle: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    const now = Date.now();
    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .filter((q) => q.gte(q.field("scheduledDate"), now))
      .take(10);

    // Enrich with candidate and job info
    const enrichedInterviews = await Promise.all(
      interviews.map(async (interview) => {
        const candidate = await ctx.db.get(interview.candidateId);
        const job = await ctx.db.get(interview.jobId);
        return {
          ...interview,
          candidateName: candidate?.name,
          jobTitle: job?.title,
        };
      })
    );

    return enrichedInterviews;
  },
});

export const createInterview = mutation({
  args: {
    candidateId: v.id("candidates"),
    jobId: v.id("jobs"),
    interviewerId: v.optional(v.id("users")),
    scheduledDate: v.number(),
    duration: v.optional(v.number()),
    type: v.union(
      v.literal("phone"),
      v.literal("video"),
      v.literal("in-person"),
      v.literal("technical"),
      v.literal("final")
    ),
    notes: v.optional(v.string()),
  },
  returns: v.id("interviews"),
  handler: async (ctx, args) => {
    const interview = await ctx.db.insert("interviews", {
      ...args,
      status: "scheduled",
    });
    return interview;
  },
});

export const updateInterview = mutation({
  args: {
    id: v.id("interviews"),
    scheduledDate: v.optional(v.number()),
    duration: v.optional(v.number()),
    type: v.optional(
      v.union(
        v.literal("phone"),
        v.literal("video"),
        v.literal("in-person"),
        v.literal("technical"),
        v.literal("final")
      )
    ),
    status: v.optional(
      v.union(
        v.literal("scheduled"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no-show")
      )
    ),
    notes: v.optional(v.string()),
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
    nextSteps: v.optional(v.string()),
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

export const completeInterview = mutation({
  args: {
    id: v.id("interviews"),
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
    nextSteps: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      status: "completed",
    });
    return null;
  },
});

export const cancelInterview = mutation({
  args: {
    id: v.id("interviews"),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "cancelled",
      notes: args.notes,
    });
    return null;
  },
});
