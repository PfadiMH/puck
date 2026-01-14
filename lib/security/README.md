# Lib Security

Authorization & Access Control domain logic.

### Contents

- **`permissions.ts`**: Roles, permissions, and check helpers (`hasPermission`, `checkPermission`).
- **`server-guard.ts`**: Server-side guard (`requireServerPermission`).
- **`use-permission.ts`**: Client-side hook (`useHasPermission`).

### Boundaries

- ❌ No NextAuth configuration here.
- ✅ All access control logic belongs here.
