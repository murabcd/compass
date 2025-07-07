import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getJobs = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("jobs"),
			_creationTime: v.number(),
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
		}),
	),
	handler: async (ctx) => {
		const jobs = await ctx.db.query("jobs").collect();
		return jobs;
	},
});

export const getJob = query({
	args: {
		id: v.id("jobs"),
	},
	returns: v.union(
		v.object({
			_id: v.id("jobs"),
			_creationTime: v.number(),
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
		}),
		v.null(),
	),
	handler: async (ctx, args) => {
		const job = await ctx.db.get(args.id);
		return job;
	},
});

export const createJob = mutation({
	args: {
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
	},
	returns: v.id("jobs"),
	handler: async (ctx, args) => {
		const job = await ctx.db.insert("jobs", {
			...args,
			isActive: true,
		});
		return job;
	},
});

export const updateJob = mutation({
	args: {
		id: v.id("jobs"),
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
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const { id, ...updateData } = args;
		await ctx.db.patch(id, updateData);
		return null;
	},
});

export const deleteJob = mutation({
	args: {
		id: v.id("jobs"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return null;
	},
});

export const toggleJobStatus = mutation({
	args: {
		id: v.id("jobs"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const job = await ctx.db.get(args.id);
		if (!job) {
			throw new Error("Job not found");
		}
		await ctx.db.patch(args.id, { isActive: !job.isActive });
		return null;
	},
});
