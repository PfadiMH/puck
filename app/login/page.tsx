import { signIn, signOut } from "@lib/auth/auth";
import {
  createEvaluator,
  hasAnyPermission,
  requireAuth,
} from "@lib/auth/authorization";
import { getRolesPermissions } from "@lib/db/database";

export default async function Page() {
  const session = await requireAuth(
    createEvaluator(hasAnyPermission, "custom")
  );

  const permissions = await getRolesPermissions(session?.user.roles || []);

  return (
    <>
      <h2>Session</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <h2>Permissions</h2>
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
      <form
        action={async () => {
          "use server";
          await signIn("keycloak");
        }}
      >
        <button type="submit">Signin with Keycloak</button>
      </form>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Signout</button>
      </form>
    </>
  );
}
