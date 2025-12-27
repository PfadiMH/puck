import { DevelopmentLoginLink } from "@components/auth/DevelopmentLoginLink";
import { auth, signIn, signOut } from "@lib/auth/auth-client";


export default async function Page() {
  if (process.env.NODE_ENV !== "development") {
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
          await signIn();
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
