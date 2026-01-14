import { Session } from "next-auth";
import { auth } from "../auth/auth-client";

export const assignablePermissions = [
  // @keep-sorted
  "admin-ui:read",
  "asset:create",
  "asset:delete",
  "asset:update",
  "footer:update",
  "global-admin",
  "navbar:update",
  "page:create",
  "page:delete",
  "page:update",
  "role-permissions:read",
  "role-permissions:update",
] as const;

/**
 * Represents a specific resource permission that can be assigned to roles.
 */
export type Permission = (typeof assignablePermissions)[number];

export interface SecurityConfig {
  roles: Role[];
}

export type Role = {
  name: string;
  description: string;
  permissions: Permission[];
};

export const defaultSecurityConfig: SecurityConfig = {
  roles: [
    {
      name: "Admin",
      description: "Admin role with all permissions",
      permissions: ["global-admin"],
    },
    {
      name: "Leiter",
      description: "Leiter role with limited permissions",
      permissions: [
        "page:create",
        "page:update",
        "page:delete",
        "admin-ui:read",
        "navbar:update",
        "footer:update",
      ],
    },
    {
      name: "JungLeiter",
      description: "JungLeiter role with limited permissions",
      permissions: ["page:update", "admin-ui:read"],
    },
  ],
};

/**
 * Evaluates if a session has the required permissions.
 */
export function checkPermission(
  session: Session | null | undefined,
  permissions: Permission[],
  options?: { requireAll?: boolean }
): boolean {
  if (!session?.user) return false;
  if (session.user.permissions.includes("global-admin")) return true;

  if (options?.requireAll) {
    return permissions.every((p) => session.user.permissions.includes(p));
  }
  return permissions.some((p) => session.user.permissions.includes(p));
}

/**
 * Async helper to check permissions for the current session.
 */
export async function hasPermission(
  permissions: Permission[],
  options?: { requireAll?: boolean }
): Promise<boolean> {
  const session = await auth();
  return checkPermission(session, permissions, options);
}
