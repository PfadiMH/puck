import { Session } from "next-auth";
import { forbidden, unauthorized } from "next/navigation";
import { auth } from "../auth/auth-client";
import { hasPermission, Policy } from "./permission-evaluator";

/**
 * Ensure a server-side session exists and that the session satisfies the provided authorization policy.
 *
 * Triggers an unauthorized response when there is no authenticated user, and a forbidden response when the session does not satisfy the policy.
 *
 * @param policy - The authorization policy to evaluate against the current session
 * @returns The active `Session` when authentication and authorization succeed
 */
export async function requireServerPermission(
  policy: Policy
): Promise<Session> {
  const session = await auth();

  // 1. Authentication Check
  if (!session?.user) unauthorized();

  // 2. Authorization Check
  if (!hasPermission(session, policy)) forbidden();

  return session;
}