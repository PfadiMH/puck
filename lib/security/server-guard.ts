import { Session } from "next-auth";
import { forbidden, unauthorized } from "next/navigation";
import { auth } from "../auth/auth-client";
import { Permission } from "./permissions";

import { hasPermissionEvaluator } from "./permission-utils";

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


