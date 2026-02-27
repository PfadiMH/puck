export const assignablePermissions = [
  // @keep-sorted
  "admin-ui:read",
  "asset:create",
  "asset:delete",
  "asset:update",
  "calendar:read",
  "calendar:update",
  "files:create",
  "files:delete",
  "files:read",
  "footer:update",
  "global-admin",
  "navbar:update",
  "page:create",
  "page:delete",
  "page:update",
  "role-permissions:read",
  "role-permissions:update",
  "shop:read",
  "shop:update",
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
        "files:read",
        "files:create",
        "files:delete",
        "shop:read",
        "shop:update",
        "calendar:read",
        "calendar:update",
      ],
    },
    {
      name: "JungLeiter",
      description: "JungLeiter role with limited permissions",
      permissions: ["page:update", "admin-ui:read"],
    },
  ],
};
