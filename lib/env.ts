import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  INTERNAL_API_BASE_URL: z.url().min(1),
  MONGODB_CONNECTION_STRING: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1),
  MOCK_AUTH: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

const skipValidation = !!process.env.SKIP_ENV_VALIDATION;

// If we are skipping validation (e.g. during build), we provide these defaults
// to satisfy TypeScript and strict Zod checks without requiring real secrets.
// We use a valid-looking mongo URI to prevent MongoClient from throwing immediately.
const buildRequiredDefaults = {
  AUTH_SECRET: "build_secret_placeholder",
  INTERNAL_API_BASE_URL: "http://localhost:3000",
  MONGODB_CONNECTION_STRING: "mongodb://localhost:27017/build_placeholder",
  MONGODB_DB_NAME: "build_placeholder",
};

export const env = skipValidation
  ? { ...buildRequiredDefaults, ...process.env } as z.infer<typeof envSchema>
  : envSchema.parse(process.env);
