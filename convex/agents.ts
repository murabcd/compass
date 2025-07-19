import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAgentsByAssistant = query({
	args: {
		assistantId: v.id("assistants"),
	},
	returns: v.array(
		v.object({
			_id: v.id("agents"),
			_creationTime: v.number(),
			assistantId: v.id("assistants"),
			name: v.string(),
			instruction: v.string(),
			handoffDescription: v.optional(v.string()),
			order: v.number(),
		}),
	),
	handler: async (ctx, args) => {
		const agents = await ctx.db
			.query("agents")
			.withIndex("by_assistant", (q) => q.eq("assistantId", args.assistantId))
			.order("asc")
			.collect();
		return agents;
	},
});

export const getAgent = query({
	args: {
		id: v.id("agents"),
	},
	returns: v.union(
		v.object({
			_id: v.id("agents"),
			_creationTime: v.number(),
			assistantId: v.id("assistants"),
			name: v.string(),
			instruction: v.string(),
			handoffDescription: v.optional(v.string()),
			order: v.number(),
		}),
		v.null(),
	),
	handler: async (ctx, args) => {
		const agent = await ctx.db.get(args.id);
		return agent;
	},
});

export const createAgent = mutation({
	args: {
		assistantId: v.id("assistants"),
		name: v.string(),
		instruction: v.string(),
		handoffDescription: v.optional(v.string()),
		order: v.optional(v.number()),
	},
	returns: v.id("agents"),
	handler: async (ctx, args) => {
		// If no order specified, set it to be the last one
		let order = args.order;
		if (order === undefined) {
			const existingAgents = await ctx.db
				.query("agents")
				.withIndex("by_assistant", (q) => q.eq("assistantId", args.assistantId))
				.collect();
			order = existingAgents.length + 1;
		}

		const agent = await ctx.db.insert("agents", {
			assistantId: args.assistantId,
			name: args.name,
			instruction: args.instruction,
			handoffDescription: args.handoffDescription,
			order,
		});
		return agent;
	},
});

export const updateAgent = mutation({
	args: {
		id: v.id("agents"),
		name: v.string(),
		instruction: v.string(),
		handoffDescription: v.optional(v.string()),
		order: v.optional(v.number()),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const { id, ...updateData } = args;
		await ctx.db.patch(id, updateData);
		return null;
	},
});

export const deleteAgent = mutation({
	args: {
		id: v.id("agents"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return null;
	},
});

export const reorderAgents = mutation({
	args: {
		assistantId: v.id("assistants"),
		agentIds: v.array(v.id("agents")),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		// Update the order for each agent based on their position in the array
		for (let i = 0; i < args.agentIds.length; i++) {
			await ctx.db.patch(args.agentIds[i], { order: i + 1 });
		}
		return null;
	},
});
