import AdminPage from "@components/page/admin/AdminPage";
import { hasAnyPermission, requirePageAuth } from "@lib/auth/auth-functions";

export default async function Page() {
  const session = await requirePageAuth(hasAnyPermission("admin-ui:read"));

  return <AdminPage />;
}
