import SecurityManager from "@components/page/security/SecurityManager";
import { requireServerPermission } from "@lib/security/server-guard";

export default async function Page() {
  const session = await requireServerPermission(["role-permissions:read"]);

  return <SecurityManager />;
}
