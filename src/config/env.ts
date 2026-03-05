import { z } from "zod/v4";

const envSchema = z.object({
  ETHEREUM_RPC_URL: z.url(),
  ETHEREUM_WS_URL: z.url().optional(),
  ETHEREUM_RPC_URL_FALLBACK: z.url().optional(),
  CACHE_MAX_ENTRIES: z.coerce.number().int().positive().default(5000),
  RPC_MAX_CONCURRENT: z.coerce.number().int().positive().default(10),
  RPC_REQUESTS_PER_SECOND: z.coerce.number().int().positive().default(25),
});

function getEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

export const env = getEnv();
