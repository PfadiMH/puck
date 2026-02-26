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
    AUTH_KEYCLOAK_IDP_HINT: z.string().optional(),
    // Stripe
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    // S3-Compatible Storage
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_PUBLIC_URL: z.string().optional(),
    // Hitobito (MiData) API
    HITOBITO_BASE_URL: z.string().optional(),
    HITOBITO_API_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
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
    AUTH_KEYCLOAK_IDP_HINT: process.env.AUTH_KEYCLOAK_IDP_HINT,
    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    // S3-Compatible Storage
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,
    // Hitobito (MiData) API
    HITOBITO_BASE_URL: process.env.HITOBITO_BASE_URL,
    HITOBITO_API_TOKEN: process.env.HITOBITO_API_TOKEN,
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

      // Stripe: webhook secret required when Stripe is configured
      if (v.STRIPE_SECRET_KEY && !v.STRIPE_WEBHOOK_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "STRIPE_WEBHOOK_SECRET is required when STRIPE_SECRET_KEY is configured",
        });
      }

      // Hitobito: both URL and token required together
      if (
        (v.HITOBITO_BASE_URL && !v.HITOBITO_API_TOKEN) ||
        (!v.HITOBITO_BASE_URL && v.HITOBITO_API_TOKEN)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "HITOBITO_BASE_URL and HITOBITO_API_TOKEN must both be set together",
        });
      }
    }),
});
