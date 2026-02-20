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
    // S3-Compatible Storage
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_PUBLIC_URL: z.string().optional(),
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
    // S3-Compatible Storage
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
  createFinalSchema: (shape) =>
    z.object(shape).superRefine((v, ctx) => {
      const s3Configured = [
        v.S3_BUCKET,
        v.S3_ENDPOINT,
        v.S3_ACCESS_KEY_ID,
        v.S3_SECRET_ACCESS_KEY,
      ].some(Boolean);

      if (s3Configured && !v.S3_PUBLIC_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "S3_PUBLIC_URL is required when S3 storage is configured",
        });
      }
    }),
});
