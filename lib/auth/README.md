# Lib Auth

## Responsibility: Identity & Infrastructure

This directory contains **Authentication Infrastructure** logic. It handles "Who the user is".

### Contents
- **`auth-client.ts`**: NextAuth configuration, Identity Providers (Keycloak, Mock), and Session hydration.
- **`mock-auth-config.ts`**: Configuration for the local development mock identity provider.

### Boundaries
- ❌ Do NOT put Permission/Role definitions here.
- ❌ Do NOT put Authorization logic here.
- ✅ DO put Session management and Identity Provider config here.
