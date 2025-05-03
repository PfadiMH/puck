import AccessPage from "@components/page/access/AccessPage";
import { hasAnyPermission, requirePageAuth } from "@lib/auth/auth-functions";

export default async function Page() {
  const session = await requirePageAuth(
    hasAnyPermission("role-permissions:read")
  );

  return <AccessPage />;
}
