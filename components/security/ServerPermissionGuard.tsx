import { auth } from "@lib/auth/auth-client";
import { hasPermission, Policy } from "@lib/security/permission-evaluator";
import { PropsWithChildren } from "react";

type ServerPermissionGuardProps = {
  policy: Policy;
};

/**
 * Renders children only when there is an authenticated user and that session satisfies the provided policy.
 *
 * @param policy - Authorization policy to evaluate against the current session.
 * @returns The `children` fragment if authorization succeeds, `null` otherwise.
 */
export async function ServerPermissionGuard({
  policy,
  children,
}: PropsWithChildren<ServerPermissionGuardProps>) {
  const session = await auth();

  // 1. Authentication Check
  if (!session?.user) return null;

  // 2. Authorization Check
  if (!hasPermission(session, policy)) return null;

  return <>{children}</>;
}