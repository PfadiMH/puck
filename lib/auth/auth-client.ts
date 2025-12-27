import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { getMockAuthProvider } from "./mock-auth-config";

const USE_MOCK_AUTH = process.env.MOCK_AUTH === "true" && process.env.NODE_ENV !== "production";

const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/auth",
  providers: [
    ...(USE_MOCK_AUTH
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


const signInMethod =
  USE_MOCK_AUTH
    ? () => signIn("credentials")
    : () => signIn("keycloak");

export { auth, handlers, signInMethod as signIn, signOut };
