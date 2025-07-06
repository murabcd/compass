import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		VITE_CONVEX_URL: z.string().url(),
		VITE_OPENAI_API_KEY: z.string().min(1),
		VITE_OPENAI_BASE_URL: z.string().url(),
		AUTH_GOOGLE_ID: z.string().min(1),
		AUTH_GOOGLE_SECRET: z.string().min(1),
	},

	clientPrefix: "PUBLIC_",

	client: {},

	runtimeEnv: process.env,

	emptyStringAsUndefined: true,
});
