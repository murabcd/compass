import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    resume: v.string(),
    coverLetter: v.string(),
    jobId: v.id("jobs"),
    status: v.union(
      v.literal("pending"),
      v.literal("shortlisted"),
      v.literal("rejected")
    ),
    interviewDate: v.optional(v.number()),
    interviewer: v.optional(v.string()),
  }),

  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.number(),
  }),
});
