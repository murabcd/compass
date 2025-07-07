import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
	...authTables,

	users: defineTable({
		name: v.string(),
		email: v.string(),
		image: v.string(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		emailVerificationTime: v.optional(v.number()),
	}).index("email", ["email"]),

	talent: defineTable({
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
	}).searchIndex("by_description_title_and_skills", {
		searchField: "description",
		filterFields: ["title", "vettedSkills"],
	}),

	jobs: defineTable({
		title: v.string(),
		skills: v.array(v.string()),
		hiresNeeded: v.number(),
		location: v.union(
			v.literal("remote"),
			v.literal("hybrid"),
			v.literal("on-site"),
		),
		employmentType: v.union(v.literal("full-time"), v.literal("part-time")),
		seniorityLevel: v.union(
			v.literal("internship"),
			v.literal("entry-level"),
			v.literal("associate"),
			v.literal("mid-senior-level"),
			v.literal("director"),
			v.literal("executive"),
			v.literal("not-applicable"),
		),
		salaryMin: v.number(),
		salaryMax: v.number(),
		isActive: v.optional(v.boolean()),
	})
		.index("by_active", ["isActive"])
		.index("by_location", ["location"])
		.index("by_employment_type", ["employmentType"])
		.index("by_seniority", ["seniorityLevel"]),

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

	candidates: defineTable({
		jobId: v.id("jobs"),
		talentId: v.id("talent"),
		resumeScore: v.number(),
		status: v.union(
			v.literal("applied"),
			v.literal("reviewed"),
			v.literal("shortlisted"),
			v.literal("rejected"),
			v.literal("hired"),
		),
	})
		.index("by_job", ["jobId"])
		.index("by_talent", ["talentId"])
		.index("by_job_status", ["jobId", "status"]),
});
