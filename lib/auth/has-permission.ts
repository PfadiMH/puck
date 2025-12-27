import { auth } from "./auth-client";
import { hasAllPermissionsEvaluator, hasAnyPermissionEvaluator } from "./auth-functions";
import { Permission } from "./permissions";

export async function hasPermission(
  permissions: Permission[],
  requireAll: boolean = false
): Promise<boolean> {
  const session = await auth();

  if (!session) return false;

  return requireAll
    ? hasAllPermissionsEvaluator(session, ...permissions)
    : hasAnyPermissionEvaluator(session, ...permissions);
}
