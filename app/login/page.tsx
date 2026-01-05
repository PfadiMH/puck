import { DevelopmentLoginLink } from "@components/security/dev/DevSignInLink";
import { auth, signIn, signOut } from "@lib/auth/auth-client";


import { env } from "@lib/env";

export default async function Page() {
  if (env.NODE_ENV !== "development") {
    return <div>Development only</div>;
  }

  const session = await auth();

  const permissions = session?.user.permissions; /* await getPermissionsByRoles(
    session?.user.roles || ["no session"]
  ); */

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
        <button type="submit" className="underline text-blue-600">Signin with Keycloak</button>
      </form>
      <DevelopmentLoginLink />
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
