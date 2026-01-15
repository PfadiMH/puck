import SecurityManager from "@components/page/security/SecurityManager";
import { requireServerPermission } from "@lib/security/server-guard";

/**
 * Server-side page component that enforces the "role-permissions:read" permission and renders the security manager UI.
 *
 * @returns The `SecurityManager` React element to render.
 * @throws An error if the server-side permission check fails.
 */
export default async function Page() {
  await requireServerPermission({ all: ["role-permissions:read"] });

  return <SecurityManager />;
}