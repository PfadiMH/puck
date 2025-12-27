# Permission System Usage Guide

This guide outlines the standard patterns for handling authorization in the application.

## 1. UI Logic

### Client (Hooks)
Use the `useHasPermission` hook for conditional rendering or state logic in Client Components.

```tsx
import { useHasPermission } from "@lib/auth/use-has-permission";

const canEdit = useHasPermission(["page:update"]);

// Using options
const canManageAll = useHasPermission(["page:update", "asset:delete"], { requireAll: true });

return (
  <Button disabled={!canEdit}>
    Edit Content
  </Button>
);
```

### Server (Inline)
Use `hasPermission` directly inside Server Components for logic that doesn't fit into a Guard.

```tsx
import { hasPermission } from "@lib/auth/has-permission";

export default async function Page() {
  const canDelete = await hasPermission(["asset:delete"]);
  
  return (
    <div>
       {canDelete && <DeleteButton />}
    </div>
  );
}
```

## 2. Guarding Blocks

Use the appropriate guard component to wrap sections of your UI.

### Client Guard
Use `PermissionGuard` in Client Components.

```tsx
import { PermissionGuard } from "@components/auth/PermissionGuard";

<PermissionGuard permissions={["admin-ui:read"]}>
  <AdminDashboard />
</PermissionGuard>
```

### Server Guard
Use `ServerPermissionGuard` in Server Components.

```tsx
import { ServerPermissionGuard } from "@components/auth/ServerPermissionGuard";

<ServerPermissionGuard permissions={["role-permissions:read"]} requireAll>
  <AdminSidebar />
</ServerPermissionGuard>
```

## 3. Server Logic (Actions & API)

Use the `hasPermission` function for logic in Server Actions or API routes.

```tsx
import { hasPermission } from "@lib/auth/has-permission";

export async function deleteAssetAction(id: string) {
  if (!(await hasPermission(["asset:delete"]))) {
    throw new Error("Unauthorized");
  }
  // Delete logic...
}
```

## 4. Requirement Flow Control

Use `requirePageAuth` or `requireActionAuth` at the start of pages or actions for early exit/redirection/errors.

```tsx
import { requirePageAuth } from "@lib/auth/auth-functions";

export default async function AdminPage() {
  // Page will error with 401 if permission is missing
  await requirePageAuth(["admin-ui:read"]); 
  
  return <Layout>...</Layout>;
}

export async function SensitiveAction() {
  // Action will throw "Unauthorized" error if permission is missing
  await requireActionAuth(["asset:delete"]);
  // ...
}
```

> [!NOTE]
> `global-admin` permission automatically bypasses all checks.
