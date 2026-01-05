export const assignablePermissions = [
  // @keep-sorted
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

export type Permission = typeof assignablePermissions[number];

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
