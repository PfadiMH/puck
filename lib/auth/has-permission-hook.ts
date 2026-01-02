import { auth } from "./auth-client";
import { hasPermissionEvaluator } from "./auth-functions";
import { Permission } from "./permissions";

export async function hasPermission(
  permissions: Permission[],
  options: { requireAll?: boolean } = {}
): Promise<boolean> {
  const session = await auth();
  return hasPermissionEvaluator(session, permissions, options);
}
