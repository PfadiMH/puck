export type Permission =
  | "page:create"
  | "page:read"
  | "page:update"
  | "page:delete"
  | "page:publish"
  | "page:unpublish"
  | "section:create"
  | "section:read"
  | "section:update"
  | "section:delete"
  | "component:create"
  | "component:read"
  | "component:update"
  | "component:delete"
  | "asset:upload"
  | "asset:read"
  | "asset:update"
  | "asset:delete"
  | "user:create"
  | "user:read"
  | "user:update"
  | "user:delete"
  | "role:create"
  | "role:read"
  | "role:update"
  | "role:delete"
  | "config:read"
  | "config:update"
  | "custom";

export interface RoleConfig {
  [key: string]: {
    description: string;
    permissions: Permission[];
  };
}

export const defaultRoleConfig: RoleConfig = {
  Admin: {
    description: "Admin role with all permissions",
    permissions: [
      "page:create",
      "page:read",
      "page:update",
      "page:delete",
      "page:publish",
      "page:unpublish",
      "section:create",
      "section:read",
      "section:update",
      "section:delete",
      "component:create",
      "component:read",
      "component:update",
      "component:delete",
      "asset:upload",
      "asset:read",
      "asset:update",
      "asset:delete",
      "user:create",
      "user:read",
      "user:update",
      "user:delete",
      "role:create",
      "role:read",
      "role:update",
      "role:delete",
      "custom",
    ],
  },
};
