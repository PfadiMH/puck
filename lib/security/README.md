# Security & Access Control

This directory contains the core logic for authorization and access control within the application. It provides a flexible, policy-based system to check permissions on both the server and the client.

## Core Concepts

- **Permissions**: Atomic strings (e.g., `page:update`, `admin-ui:read`) representing the ability to perform an action.
- **Policies**: Logical combinations of permissions. A policy can require `any` of a list of permissions, `all` of them, or both.
- **Roles**: Collections of permissions assigned to users (defined in `lib/security/security-config.ts`).
- **Global Admin**: The `global-admin` permission bypasses all checks.

---

## 1. Server-Side Protection

### A. In Server Actions or API Routes

Use `requireServerPermission` to enforce access control. It automatically handles authentication (redirects to login) and authorization (throws forbidden).

```typescript
import { requireServerPermission } from "@lib/security/server-guard";

export async function deletePage(path: string) {
  "use server";

  // Mandatory: Throws 'Forbidden' if user lacks 'page:delete'
  await requireServerPermission({ all: ["page:delete"] });

  // Logic to delete the page...
}
```

### B. In Server Components (Layouts/Pages)

You can use it to protect entire routes or sections of a page.

```typescript
import { requireServerPermission } from "@lib/security/server-guard";

export default async function AdminDashboard() {
  // Redirects to unauthorized/forbidden if check fails
  await requireServerPermission({ any: ["admin-ui:read", "global-admin"] });

  return <AdminLayout>...</AdminLayout>;
}
```

---

## 2. Client-Side Protection

### A. Conditional Rendering (Hooks)

Use `useHasPermission` to show or hide UI elements based on the user's permissions.

```typescript
"use client";

import { useHasPermission } from "@lib/security/hooks/has-permission";

export function EditButton() {
  const canEdit = useHasPermission({ all: ["page:update"] });

  if (!canEdit) return null;
  return <button>Edit Page</button>;
}
```

---

## 3. Configuration & Permissions

- **`lib/security/security-config.ts`**: Defines the list of available permissions and default roles.
- **`lib/security/permission-evaluator.ts`**: The core logic that matches session permissions against a `Policy`.

### Defining a Policy

A `Policy` object can have:

- `any`: Returns true if the user has **at least one** of these permissions.
- `all`: Returns true if the user has **all** of these permissions.

```typescript
// Example: User must have 'admin-ui:read' AND (either 'page:update' OR 'page:create')
const complexPolicy = {
  all: ["admin-ui:read"],
  any: ["page:update", "page:create"],
};
```

---

## Boundaries

- ❌ **No Authentication Logic**: NextAuth configuration and providers live in `app/auth/` and `lib/auth/`.
- ✅ **Domain Logic Only**: This folder is for _authorizing_ what an authenticated user can do.
- ❌ **No UI Components**: Generic security UI components (like guards) should live in `components/security/`.
