import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  INTERNAL_API_BASE_URL: z.url().min(1),
  DATABASE_TYPE: z.enum(["json", "mongodb", "mongo"]).optional().default("json"),
  MONGODB_CONNECTION_STRING: z.string().optional(),
  MONGODB_DB_NAME: z.string().optional(),
  MOCK_AUTH: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

export const env = envSchema.parse(process.env);
