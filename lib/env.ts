import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
    INTERNAL_API_BASE_URL: z.url().min(1),
    MONGODB_CONNECTION_STRING: z.string().min(1),
    MONGODB_DB_NAME: z.string().min(1),
    MOCK_AUTH: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional(),
    ALTCHA_HMAC_KEY: z.string().optional(),
  },
  client: {
    // Add NEXT_PUBLIC_ variables here
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    INTERNAL_API_BASE_URL: process.env.INTERNAL_API_BASE_URL,
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    MOCK_AUTH: process.env.MOCK_AUTH,
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    ALTCHA_HMAC_KEY: process.env.ALTCHA_HMAC_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
