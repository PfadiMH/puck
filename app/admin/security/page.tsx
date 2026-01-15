import SecurityManager from "@components/page/security/SecurityManager";
import { requireServerPermission } from "@lib/security/server-guard";

export default async function Page() {
  await requireServerPermission({ all: ["role-permissions:read"] });

  return <SecurityManager />;
}
