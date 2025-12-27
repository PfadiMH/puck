export const assignablePermissions = [
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
export type Permission = typeof assignablePermissions[number];

export interface SecurityConfig {
  roles: {
    [key: string]: RoleMetadata;
  };
}

export type RoleMetadata = {
  description: string;
  permissions: Permission[]
};

export const defaultRoleConfig: SecurityConfig = {
  roles: {
    Admin: {
      description: "Admin role with all permissions",
      permissions: assignablePermissions,
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
