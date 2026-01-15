import AdminPage from "@components/page/admin/AdminPage";
import { requireServerPermission } from "@lib/security/server-guard";

/**
 * Render the admin UI after enforcing that the current server request has the required read permission.
 *
 * @returns The AdminPage React element to render
 */
export default async function Page() {
  await requireServerPermission({ all: ["admin-ui:read"] });

  return <AdminPage />;
}