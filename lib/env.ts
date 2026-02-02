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
    AUTH_KEYCLOAK_IDP_HINT: z.string().optional(),
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
    AUTH_KEYCLOAK_IDP_HINT: process.env.AUTH_KEYCLOAK_IDP_HINT,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
