import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User management (recruiters, hiring managers, admins)
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("recruiter"),
      v.literal("hiring_manager"),
      v.literal("admin")
    ),
    department: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),

  // Company information
  companies: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    size: v.optional(v.string()),
    location: v.string(),
  }),

  // Job postings
  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.number(),
    salaryMax: v.optional(v.number()),
    department: v.optional(v.string()),
    employmentType: v.optional(
      v.union(
        v.literal("full-time"),
        v.literal("part-time"),
        v.literal("contract"),
        v.literal("internship")
      )
    ),
    experience: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    recruiterId: v.optional(v.id("users")),
    companyId: v.optional(v.id("companies")),
  })
    .index("by_company", ["company"])
    .index("by_recruiter", ["recruiterId"])
    .index("by_active", ["isActive"]),

  // Candidates and applications
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
      v.literal("rejected"),
      v.literal("hired")
    ),
    interviewDate: v.optional(v.number()),
    interviewer: v.optional(v.string()),
    notes: v.optional(v.string()),
    source: v.optional(v.string()), // where they applied from
    experience: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    portfolio: v.optional(v.string()),
    linkedIn: v.optional(v.string()),
    salary_expectation: v.optional(v.number()),
  })
    .index("by_job", ["jobId"])
    .index("by_status", ["status"])
    .index("by_email", ["email"]),

  // Interview tracking
  interviews: defineTable({
    candidateId: v.id("candidates"),
    jobId: v.id("jobs"),
    interviewerId: v.optional(v.id("users")),
    scheduledDate: v.number(),
    duration: v.optional(v.number()), // in minutes
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
    score: v.optional(v.number()), // 1-10 rating
    feedback: v.optional(v.string()),
    nextSteps: v.optional(v.string()),
  })
    .index("by_candidate", ["candidateId"])
    .index("by_job", ["jobId"])
    .index("by_interviewer", ["interviewerId"])
    .index("by_date", ["scheduledDate"])
    .index("by_status", ["status"]),

  // Notes and communication tracking
  notes: defineTable({
    candidateId: v.optional(v.id("candidates")),
    jobId: v.optional(v.id("jobs")),
    authorId: v.id("users"),
    content: v.string(),
    type: v.union(
      v.literal("note"),
      v.literal("email"),
      v.literal("call"),
      v.literal("meeting")
    ),
    isPrivate: v.optional(v.boolean()),
  })
    .index("by_candidate", ["candidateId"])
    .index("by_job", ["jobId"])
    .index("by_author", ["authorId"]),

  // Application pipeline stages
  pipeline_stages: defineTable({
    jobId: v.id("jobs"),
    name: v.string(),
    order: v.number(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_job", ["jobId"])
    .index("by_order", ["jobId", "order"]),
});
