import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/auth",
  providers: [
    Keycloak({
      authorization: {
        params: {
          scope: "openid profile email with_roles",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.roles = profile.roles;

        try {
          // Construct the absolute URL for the internal API endpoint
          // Ensure INTERNAL_API_BASE_URL is set in your environment variables
          const apiUrl = new URL(
            "/auth/permissions",
            process.env.INTERNAL_API_BASE_URL
          );
          const secretKey = process.env.AUTH_SECRET;

          if (!secretKey) {
            throw new Error("AUTH_SECRET environment variable is not set.");
          }
          if (!process.env.INTERNAL_API_BASE_URL) {
            throw new Error(
              "INTERNAL_API_BASE_URL environment variable is not set."
            );
          }

          const response = await fetch(apiUrl.toString(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-secret-key": secretKey,
            },
            body: JSON.stringify(profile.roles),
          });

          if (response.ok) {
            const data = await response.json();
            token.permissions = data.permissions;
          } else {
            console.error(
              `Failed to fetch permissions: ${response.status} ${
                response.statusText
              }. Body: ${await response.text()}`
            );
            token.permissions = [];
          }
        } catch (error) {
          console.error("Error calling permissions API:", error);
          token.permissions = [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
});

const signInWithKeycloak = () => signIn("keycloak");
export { auth, handlers, signInWithKeycloak as signIn, signOut };
