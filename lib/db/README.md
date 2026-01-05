# Database Usage Guide

This project uses a layered architecture for database access to ensure security and clean validation patterns.

## Architecture Overview

1.  **Public Layer (`lib/db/database.ts`)**: The secure entry point. All methods here are Server Actions marked with `"use server"` and enforce permission checks.
2.  **Internal Layer (`lib/db/service.ts`)**: The raw service singleton. It provides direct access to the database without permission checks. Use **only** in trusted contexts.
3.  **Implementation (`lib/db/mongo.ts`)**: The actual MongoDB logic.
4.  **Interface (`lib/db/types.ts`)**: Shared type definitions.

---

## 1. How to Query the Database

### A. In UI Components or Server Actions (Standard)
**Use Case**: Fetching data for a page, submitting a form, or performing any action on behalf of a user.

Always import from `@lib/db/database`. These methods automatically check for the required permissions.

```typescript
import { getSecurityConfig, saveSecurityConfig } from "@lib/db/database";

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

### B. In System Internals (Advanced)
**Use Case**: API Routes using API Keys, background jobs, or authentication logic where no user session exists.

Import `dbService` from `@lib/db/service`. **WARNING**: You must manually handle authorization.

```typescript
import { dbService } from "@lib/db/service";
import { env } from "@lib/env";
import { NextResponse } from "next/server";

export async function GET(req) {
  // 1. Validate API Key/Secret manually
  if (req.headers.get("x-secret-key") !== env.AUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch data directly (Bypasses PermissionGuard)
  const config = await dbService.getSecurityConfig(); 
  return NextResponse.json(config);
}
```

---

## 2. How to Add New Database Resources

Follow these steps to add a new entity (e.g., `Products`).

### Step 1: Update the Interface
Modify `lib/db/types.ts` to include the new methods.

```typescript
// lib/db/types.ts
export interface DatabaseService {
  // ... existing methods
  getProducts(): Promise<Product[]>;
  saveProduct(product: Product): Promise<void>;
}
```

### Step 2: Implement Logic
Update `lib/db/mongo.ts` to implement the new methods.

```typescript
// lib/db/mongo.ts
export class MongoService implements DatabaseService {
  // ...
  async getProducts() {
    return this.db.collection("products").find().toArray();
  }
}
```

### Step 3: Expose Securely
Export a wrapper in `lib/db/database.ts` with appropriate permission checks.

```typescript
// lib/db/database.ts
import { requireServerPermission } from "@lib/auth/auth-functions";

// ...

export async function getProducts() {
  // Optional: Add 'product:read' check if needed, or leave public
  // await requireServerPermission(["product:read"]); 
  return dbService.getProducts();
}

export async function saveProduct(product: Product) {
  // Mandatory: Protect write operations
  await requireServerPermission(["product:update"]);
  return dbService.saveProduct(product);
}
```
