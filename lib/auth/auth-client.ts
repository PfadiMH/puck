import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { getMockAuthProvider, getMockPermissions } from "./mock-auth-config";

const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/auth",
  providers: [
    ...(process.env.MOCK_AUTH
      ? [getMockAuthProvider()]
      : [
        Keycloak({
          authorization: {
            params: {
              scope: "openid profile email with_roles",
            },
          },
        }),
      ]),
  ],
  callbacks: {
    async jwt({ token, profile, user, trigger, session }) {
      if (trigger === "update" && session?.roles) {
        token.roles = session.roles;
      }

      if (user) {
        token.roles = (user as any).roles || profile?.roles;
      }

      // If we are mocking auth, we can just use the local roles config
      if (process.env.MOCK_AUTH && token.roles) {
        token.permissions = getMockPermissions(token.roles as string[]);
        return token;
      }

      if (token.roles && !token.permissions) {
        token.permissions = await fetchPermissions(token.roles as string[]);
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

async function fetchPermissions(roles: string[]) {
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
      throw new Error("INTERNAL_API_BASE_URL environment variable is not set.");
    }

    const response = await fetch(apiUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": secretKey,
      },
      body: JSON.stringify(roles),
    });

    if (response.ok) {
      const data = await response.json();
      return data.permissions;
    } else {
      console.error(
        `Failed to fetch permissions: ${response.status} ${response.statusText
        }. Body: ${await response.text()}`
      );
      return [];
    }
  } catch (error) {
    console.error("Error calling permissions API:", error);
    return [];
  }
}


const signInWithKeycloak = () => signIn("keycloak");
export { auth, handlers, signInWithKeycloak as signIn, signOut };
