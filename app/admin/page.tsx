import AdminPage from "@components/page/admin/AdminPage";
import { requireServerPermission } from "@lib/security/server-guard";

export default async function Page() {
  await requireServerPermission(["admin-ui:read"]);

  return <AdminPage />;
}
