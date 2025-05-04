// @keep-sorted
export type Permission =
  | "admin-ui:read"
  | "page:create"
  | "page:update"
  | "page:delete"
  | "asset:create"
  | "asset:update"
  | "asset:delete"
  | "role-permissions:read"
  | "role-permissions:update"
  | "global-admin";

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
];

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
  },
};
