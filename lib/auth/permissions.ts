export const assignablePermissions: Permission[] = [
  "admin-ui:read",
  "page:create",
  "page:update",
  "page:delete",
  "asset:create",
  "asset:update",
  "asset:delete",
  "role-permissions:read",
  "role-permissions:update",
  "navbar:update",
  "footer:update",
  "global-admin",
];

// @keep-sorted
export type Permission =
  | "admin-ui:read"
  | "page:create"
  | "page:update"
  | "page:delete"
  | "asset:create"
  | "asset:update"
  | "asset:delete"
  | "navbar:update"
  | "footer:update"
  | "role-permissions:read"
  | "role-permissions:update"
  | "global-admin";

export interface SecurityConfig {
  roles: {
    [key: string]: RoleMetadata;
  };
}

export type RoleMetadata = {
  description: string;
  permissions: Permission[]; // is Array for Database Compatibility
};

export const defaultRoleConfig: SecurityConfig = {
  roles: {
    Admin: {
      description: "Admin role with all permissions",
      permissions: ["global-admin"],
    },
    Leiter: {
      description: "Leiter role with limited permissions",
      permissions: ["page:create", "page:update", "page:delete", "admin-ui:read", "navbar:update", "footer:update"],
    },
    JungLeiter: {
      description: "JungLeiter role with limited permissions",
      permissions: ["page:update", "admin-ui:read"],
    },
  },
};
