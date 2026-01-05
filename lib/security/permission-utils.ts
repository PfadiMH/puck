import { Session } from "next-auth";
import { Permission } from "./permissions";

// Evaluator used by server guards and client hooks
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
