import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.number(),
    employmentType: v.optional(
      v.union(v.literal("full-time"), v.literal("part-time"), v.literal("contract"))
    ),
    experience: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  })
    .index("by_company", ["company"])
    .index("by_active", ["isActive"]),

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
