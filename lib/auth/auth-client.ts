import { env } from "@lib/env";
import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { getMockAuthProvider } from "./mock-auth-config";

const USE_MOCK_AUTH = env.MOCK_AUTH === "true" && env.NODE_ENV !== "production";

const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/auth",
  providers: [
    ...(USE_MOCK_AUTH ? [getMockAuthProvider()] : []),
    Keycloak({
      authorization: {
        params: {
          scope: "openid profile email with_roles",
        },
      },
    }),
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
    const internalApiBaseUrl = env.INTERNAL_API_BASE_URL;

    const apiUrl = new URL(
      "/api/security/permissions",
      internalApiBaseUrl
    );
    const secretKey = env.AUTH_SECRET;

    apiUrl.searchParams.set("roles", JSON.stringify(roles));

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "x-secret-key": secretKey,
      },
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

export { auth, handlers, signIn, signOut };
