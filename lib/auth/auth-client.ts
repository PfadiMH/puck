import { dbService } from "@lib/db/db";
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
          scope: "openid profile email roles",
          ...(env.AUTH_KEYCLOAK_IDP_HINT && { kc_idp_hint: env.AUTH_KEYCLOAK_IDP_HINT }),
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
  const config = await dbService.getSecurityConfig();

  const permissionSet = new Set<string>(
    config?.roles
      ?.filter((r) => roles.includes(r.name))
      .flatMap((r) => r.permissions || []) || []
  );

  const permissions = Array.from(permissionSet);
  return permissions;
}

export { auth, handlers, signIn, signOut };
