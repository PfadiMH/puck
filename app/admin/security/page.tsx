import SecurityManager from "@components/page/security/SecurityManager";
import { requirePageAuth } from "@lib/auth/auth-functions";

export default async function Page() {
  const session = await requirePageAuth(["role-permissions:read"]);

  return <SecurityManager />;
}
