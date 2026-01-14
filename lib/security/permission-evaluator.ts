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

  if (!(policy.any ?? []).some((perm) => sessionPermissions.includes(perm)))
    return false;

  if (!(policy.all ?? []).every((perm) => sessionPermissions.includes(perm)))
    return false;

  return true;
}
