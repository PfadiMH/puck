import { auth } from "../auth/auth-client";
import { Permission } from "./permissions";
import { hasPermissionEvaluator } from "./server-guard";

/**
 * Server-side/Universal helper to check permissions.
 * Returns boolean.
 *
 * @param permissions List of permissions to check against
 * @param options Configuration options
 */
export async function hasPermission(
  permissions: Permission[],
  options: { requireAll?: boolean } = {}
): Promise<boolean> {
  const session = await auth();
  return hasPermissionEvaluator(session, permissions, options);
}
