# Lib Security

## Responsibility: Authorization & Access Control

This directory contains **Security Domain & Logic**. It handles "What the user can do".

### Contents
- **`permissions.ts`**: Defines the Domain Entities (Roles, Permissions) and Security Configuration.
- **`server-guard.ts`**: `requireServerPermission`. Server-side guard that throws errors if access is denied.
- **`has-permission.ts`**: Universal boolean helper for checking permissions (returns true/false).
- **`use-permission.ts`**: React Hook for checking permissions on the client.

### Boundaries
- ❌ Do NOT put NextAuth configuration here.
- ✅ DO put all Access Control Logic here.
