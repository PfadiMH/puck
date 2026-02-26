import { env } from "@lib/env";
import { HitobitoClient } from "./api";

function getHitobitoClient(): HitobitoClient | null {
  const baseUrl = env.HITOBITO_BASE_URL;
  const token = env.HITOBITO_API_TOKEN;
  if (!baseUrl || !token) return null;
  return new HitobitoClient({ baseUrl, token });
}

/**
 * Hitobito API client instance. Null when HITOBITO_BASE_URL/HITOBITO_API_TOKEN
 * are not configured. Check for null before using to gracefully disable
 * Hitobito-dependent features (e.g. Organigramm).
 */
export const hitobitoClient = getHitobitoClient();
