import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  jobs: defineTable({
    title: v.string(),
    skills: v.array(v.string()),
    hiresNeeded: v.number(),
    location: v.union(v.literal("remote"), v.literal("hybrid"), v.literal("on-site")),
    employmentType: v.union(v.literal("full-time"), v.literal("part-time")),
    seniorityLevel: v.union(
      v.literal("internship"),
      v.literal("entry-level"),
      v.literal("associate"),
      v.literal("mid-senior-level"),
      v.literal("director"),
      v.literal("executive"),
      v.literal("not-applicable")
    ),
    salaryMin: v.number(),
    salaryMax: v.number(),
    isActive: v.optional(v.boolean()),
  })
    .index("by_active", ["isActive"])
    .index("by_location", ["location"])
    .index("by_employment_type", ["employmentType"])
    .index("by_seniority", ["seniorityLevel"]),

  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    resume: v.string(),
    cv: v.string(),
    jobId: v.id("jobs"),
    status: v.union(
      v.literal("pending"),
      v.literal("shortlisted"),
      v.literal("rejected"),
      v.literal("hired")
    ),
    interviewDate: v.optional(v.number()),
    interviewer: v.optional(v.string()),
    notes: v.optional(v.string()),
    experience: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    portfolio: v.optional(v.string()),
  })
    .index("by_job", ["jobId"])
    .index("by_status", ["status"])
    .index("by_email", ["email"]),

  interviews: defineTable({
    candidateId: v.id("candidates"),
    jobId: v.id("jobs"),
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
    .index("by_candidate", ["candidateId"])
    .index("by_job", ["jobId"])
    .index("by_date", ["scheduledDate"])
    .index("by_status", ["status"]),

  assistants: defineTable({
    name: v.string(),
    description: v.string(),
    model: v.string(),
    temperature: v.number(),
    maxTokens: v.number(),
    voice: v.string(),
    speed: v.number(),
    isActive: v.boolean(),
  }).index("by_active", ["isActive"]),

  agents: defineTable({
    assistantId: v.id("assistants"),
    name: v.string(),
    instruction: v.string(),
    handoffDescription: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_assistant", ["assistantId"])
    .index("by_assistant_order", ["assistantId", "order"]),
});
