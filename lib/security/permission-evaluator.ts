import type { Session } from "next-auth";
import type { Permission } from "./security-config";

export type Policy = {
  any?: Permission[];
  all?: Permission[];
};

/**
 * Determines whether a session satisfies the provided permission policy.
 *
 * @param session - The NextAuth session to evaluate; returns `false` if missing or if `session.user` is absent.
 * @param policy - Policy describing required permissions. `any` lists permissions where at least one must be present; `all` lists permissions where every entry must be present.
 * @returns `true` if the session contains `"global-admin"` or meets the policy requirements, `false` otherwise.
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