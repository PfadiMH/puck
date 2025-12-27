import AdminPage from "@components/page/admin/AdminPage";
import { requirePageAuth } from "@lib/auth/auth-functions";

export default async function Page() {
  const session = await requirePageAuth(["admin-ui:read"]);

  return <AdminPage />;
}
