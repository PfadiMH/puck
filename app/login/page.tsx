import { auth, signIn, signOut } from "@lib/auth/auth";

export default async function Page() {
  const session = await auth();

  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
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
