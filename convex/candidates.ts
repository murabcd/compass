import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCandidatesByJob = query({
	args: {
		jobId: v.id("jobs"),
	},
	returns: v.array(
		v.object({
			_id: v.id("candidates"),
			_creationTime: v.number(),
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
			talent: v.object({
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
		}),
	),
	handler: async (ctx, args) => {
		const candidates = await ctx.db
			.query("candidates")
			.withIndex("by_job", (q) => q.eq("jobId", args.jobId))
			.collect();

		const candidatesWithTalent = await Promise.all(
			candidates.map(async (candidate) => {
				const talent = await ctx.db.get(candidate.talentId);
				if (!talent) {
					throw new Error("Talent not found");
				}
				return {
					...candidate,
					talent,
				};
			}),
		);

		return candidatesWithTalent;
	},
});

export const createCandidate = mutation({
	args: {
		jobId: v.id("jobs"),
		talentId: v.id("talent"),
		resumeScore: v.number(),
	},
	returns: v.id("candidates"),
	handler: async (ctx, args) => {
		const existingCandidate = await ctx.db
			.query("candidates")
			.withIndex("by_job", (q) => q.eq("jobId", args.jobId))
			.filter((q) => q.eq(q.field("talentId"), args.talentId))
			.first();

		if (existingCandidate) {
			throw new Error("Candidate already exists for this job and talent");
		}

		const candidate = await ctx.db.insert("candidates", {
			...args,
			status: "applied",
		});

		return candidate;
	},
});

export const updateCandidateStatus = mutation({
	args: {
		id: v.id("candidates"),
		status: v.union(
			v.literal("applied"),
			v.literal("reviewed"),
			v.literal("shortlisted"),
			v.literal("rejected"),
			v.literal("hired"),
		),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, { status: args.status });
		return null;
	},
});

export const moveToJob = mutation({
	args: {
		candidateId: v.id("candidates"),
		newJobId: v.id("jobs"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const candidate = await ctx.db.get(args.candidateId);
		if (!candidate) {
			throw new Error("Candidate not found");
		}

		const existingCandidate = await ctx.db
			.query("candidates")
			.withIndex("by_job", (q) => q.eq("jobId", args.newJobId))
			.filter((q) => q.eq(q.field("talentId"), candidate.talentId))
			.first();

		if (existingCandidate) {
			throw new Error("Candidate already exists for this job");
		}

		await ctx.db.patch(args.candidateId, {
			jobId: args.newJobId,
			status: "applied",
		});

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
