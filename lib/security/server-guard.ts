import { Session } from "next-auth";
import { forbidden, unauthorized } from "next/navigation";
import { auth } from "../auth/auth-client";
import { hasPermission, Policy } from "./permission-evaluator";

// its important to catch the errors thrown here by *components* who call them. (not the actions)
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
