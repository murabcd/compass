import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getJobs = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("jobs"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      company: v.string(),
      location: v.string(),
      salary: v.number(),
    })
  ),
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();
    return jobs;
  },
});

export const createJob = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.number(),
  },
  returns: v.id("jobs"),
  handler: async (ctx, args) => {
    const job = await ctx.db.insert("jobs", args);
    return job;
  },
});

export const updateJob = mutation({
  args: {
    id: v.id("jobs"),
    title: v.string(),
    description: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.number(),
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
