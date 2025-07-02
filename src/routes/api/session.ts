import { createServerFileRoute } from "@tanstack/react-start/server";
import { env } from "@/env";
import { getModelId, modelRealtimeMini } from "@/lib/ai/models";

export const ServerRoute = createServerFileRoute("/api/session").methods({
  GET: async ({ request }) => {
    try {
      const response = await fetch(`${env.VITE_OPENAI_BASE_URL}/v1/realtime/sessions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: getModelId(modelRealtimeMini),
        }),
      });

      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error("Error in /api/session:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
});
