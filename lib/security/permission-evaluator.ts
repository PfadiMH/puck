import type { Session } from "next-auth";
import type { Permission } from "./security-config";

export type Policy = {
  any?: Permission[];
  all?: Permission[];
};

/**
 * Evaluates if a session has the required permissions.
 */
export function hasPermission(
  session: Session | null | undefined,
  policy: Policy
): boolean {
  if (!session?.user) return false;
  if (session.user.permissions.includes("global-admin")) return true;

  const sessionPermissions = session.user.permissions;

  const anyPerms = policy.any ?? [];
  if (
    anyPerms.length > 0 &&
    !anyPerms.some((perm) => sessionPermissions.includes(perm))
  )
    return false;

  const allPerms = policy.all ?? [];
  if (
    allPerms.length > 0 &&
    !allPerms.every((perm) => sessionPermissions.includes(perm))
  )
    return false;

  return true;
}
