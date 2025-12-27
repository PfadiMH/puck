import AccessPage from "@components/page/access/AccessPage";
import { requirePageAuth } from "@lib/auth/auth-functions";

export default async function Page() {
  const session = await requirePageAuth(["role-permissions:read"]);

  return <AccessPage />;
}
