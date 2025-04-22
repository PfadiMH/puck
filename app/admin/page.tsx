import AdminPage from "@components/page/admin/AdminPage";
import {
  createEvaluator,
  hasAnyPermission,
  requirePageAuth,
} from "@lib/auth/authorization";

export default async function Page() {
  await requirePageAuth(createEvaluator(hasAnyPermission, "custom"));
  return <AdminPage />;
}
