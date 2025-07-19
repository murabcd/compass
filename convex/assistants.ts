import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAssistants = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("assistants"),
			_creationTime: v.number(),
			name: v.string(),
			description: v.string(),
			model: v.string(),
			temperature: v.number(),
			maxTokens: v.number(),
			voice: v.string(),
			speed: v.number(),
			isActive: v.boolean(),
		}),
	),
	handler: async (ctx) => {
		const assistants = await ctx.db.query("assistants").collect();
		return assistants;
	},
});

export const getAssistant = query({
	args: {
		id: v.id("assistants"),
	},
	returns: v.union(
		v.object({
			_id: v.id("assistants"),
			_creationTime: v.number(),
			name: v.string(),
			description: v.string(),
			model: v.string(),
			temperature: v.number(),
			maxTokens: v.number(),
			voice: v.string(),
			speed: v.number(),
			isActive: v.boolean(),
		}),
		v.null(),
	),
	handler: async (ctx, args) => {
		const assistant = await ctx.db.get(args.id);
		return assistant;
	},
});

export const createAssistant = mutation({
	args: {
		name: v.string(),
		description: v.string(),
		model: v.string(),
		temperature: v.number(),
		maxTokens: v.optional(v.number()),
		voice: v.optional(v.string()),
		speed: v.optional(v.number()),
	},
	returns: v.id("assistants"),
	handler: async (ctx, args) => {
		const assistant = await ctx.db.insert("assistants", {
			...args,
			maxTokens: args.maxTokens || 4096,
			voice: args.voice || "ash",
			speed: args.speed || 1.0,
			isActive: true,
		});
		return assistant;
	},
});

export const updateAssistant = mutation({
	args: {
		id: v.id("assistants"),
		name: v.string(),
		description: v.string(),
		model: v.string(),
		temperature: v.number(),
		maxTokens: v.number(),
		voice: v.string(),
		speed: v.number(),
		isActive: v.boolean(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const { id, ...updateData } = args;
		await ctx.db.patch(id, updateData);
		return null;
	},
});

export const deleteAssistant = mutation({
	args: {
		id: v.id("assistants"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const agents = await ctx.db
			.query("agents")
			.withIndex("by_assistant", (q) => q.eq("assistantId", args.id))
			.collect();

		for (const agent of agents) {
			await ctx.db.delete(agent._id);
		}

		await ctx.db.delete(args.id);
		return null;
	},
});

export const toggleAssistantStatus = mutation({
	args: {
		id: v.id("assistants"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const assistant = await ctx.db.get(args.id);
		if (!assistant) {
			throw new Error("Assistant not found");
		}
		await ctx.db.patch(args.id, { isActive: !assistant.isActive });
		return null;
	},
});
