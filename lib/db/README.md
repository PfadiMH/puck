# Database Usage Guide

This project uses a layered architecture for database access to ensure security and clean validation patterns.

## Architecture Overview

1.  **Public Actions Layer (`lib/db/db-actions.ts`)**: The secure entry point. All methods here are Server Actions marked with `"use server"` and enforce permission checks.
2.  **Service Layer (`lib/db/db.ts`)**: Defines the `DatabaseService` interface and provides the `dbService` singleton. The `dbService` offers direct access to the database without permission checks. Use **only** in trusted contexts.
3.  **Implementations (`lib/db/db-mongo-impl.ts`, `lib/db/db-mock-impl.ts`)**: Contains the actual MongoDB logic and a mock implementation for development/testing.

---

## 1. How to Query the Database

### A. In UI Components or Server Actions (Standard)

**Use Case**: Fetching data for a page, submitting a form, or performing any action on behalf of a user.

Always import from `@lib/db/db-actions`. These methods automatically check for the required permissions.

```typescript
import { getSecurityConfig, saveSecurityConfig } from "@lib/db/db-actions";

// In a React Server Component
export default async function SecurityPage() {
  // Safe: Checks 'role-permissions:read' internally
  const config = await getSecurityConfig();
  return <SecurityManager config={config} />;
}

// In a Server Action
export async function updateRoles(config) {
  "use server";
  // Safe: Throws 'Forbidden' if user lacks 'role-permissions:update' permission
  await saveSecurityConfig(config);
}
```

### B. In Client Components (TanStack Query)

**Use Case**: Fetching data in components that need to be interactive or handle loading/error states explicitly.

Import the actions from `@lib/db/db-actions` and use them with `useQuery` or `useMutation`.

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { getSecurityConfig } from "@lib/db/db-actions";

export function SecurityManager() {
  const { data, isLoading } = useQuery({
    queryKey: ["securityConfig"],
    queryFn: getSecurityConfig,
  });

  if (isLoading) return <div>Loading...</div>;
  return <SecurityForm initialData={data} />;
}
```

For mutations (saving data):

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePage } from "@lib/db/db-actions";

// Inside your component
const queryClient = useQueryClient();
const { mutate } = useMutation({
  mutationFn: async () => savePage(path, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["pages"] });
  },
});
```

---

## 2. How to Add New Database Resources

Follow these steps to add a new entity (e.g., `Products`).

### Step 1: Update the Interface

Modify `lib/db/db.ts` to include the new methods in the `DatabaseService` interface.

```typescript
// lib/db/db.ts
export interface DatabaseService {
  // ... existing methods
  getProducts(): Promise<Product[]>;
  saveProduct(product: Product): Promise<void>;
}
```

### Step 2: Implement Logic

Update `lib/db/db-mongo-impl.ts` to implement the new methods.

```typescript
// lib/db/db-mongo-impl.ts
export class MongoService implements DatabaseService {
  // ...
  async getProducts() {
    return this.db.collection("products").find().toArray();
  }
}
```

### Step 3: Expose Securely

Export a wrapper in `lib/db/db-actions.ts` with appropriate permission checks.

```typescript
// lib/db/db-actions.ts
import { requireServerPermission } from "@lib/security/server-guard";

// ...

export async function getProducts() {
  // Optional: Add 'product:read' check if needed, or leave public
  // await requireServerPermission({ all: ["product:read"] });
  return dbService.getProducts();
}

export async function saveProduct(product: Product) {
  // Mandatory: Protect write operations
  await requireServerPermission({ all: ["product:update"] });
  return dbService.saveProduct(product);
}
```
