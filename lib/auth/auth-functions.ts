import { Session } from "next-auth";
import { forbidden, unauthorized } from "next/navigation";
import { auth } from "./auth-client";
import { Permission } from "./permissions";

// its important to catch the errors thrown here by *components* who call them. (not the actions)
export async function requireServerPermission(
  permissions?: Permission[],
  options: { requireAll?: boolean } = {}
): Promise<Session> {
  const session = await auth();

  // 1. Authentication Check
  if (!session?.user) {
    unauthorized();
  }

  // 2. Authorization Check
  if (permissions && permissions.length > 0) {
    if (!hasPermissionEvaluator(session, permissions, options)) {
      forbidden();
    }
  }

  return session;
}

// Evaluator used by the helpers above and hooks/server functions
export function hasPermissionEvaluator(
  session: Session | null | undefined,
  permissions: Permission[],
  options: { requireAll?: boolean } = {}
): boolean {
  if (!session?.user) return false;
  if (session.user.permissions.includes("global-admin")) return true;

  if (options.requireAll) {
    return permissions.every((p) => session.user.permissions.includes(p));
  }
  return permissions.some((p) => session.user.permissions.includes(p));
}

