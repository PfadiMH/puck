import { dbService } from "@lib/db/db";
import { env } from "@lib/env";
import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { getMockAuthProvider } from "./mock-auth-config";

const USE_MOCK_AUTH = env.MOCK_AUTH === "true";

/**
 * Maps SSO helper `hirarchy_level` values to security-config role names.
 * SSO helper outputs: "admin" | "leader" | "member" | "none"
 * Security config expects: "Admin" | "Leiter" | "JungLeiter"
 */
const HIERARCHY_TO_ROLES: Record<string, string[]> = {
  admin: ["Admin"],
  leader: ["Leiter"],
  member: ["JungLeiter"],
  none: [],
};

function resolveRoles(profile: Record<string, unknown> | undefined): string[] {
  const directRoles = profile?.roles;
  if (Array.isArray(directRoles) && directRoles.length > 0) {
    return directRoles as string[];
  }

  const level = profile?.hirarchy_level;
  if (typeof level === "string" && level in HIERARCHY_TO_ROLES) {
    return HIERARCHY_TO_ROLES[level];
  }

  return [];
}

const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/auth",
  providers: [
    ...(USE_MOCK_AUTH ? [getMockAuthProvider()] : []),
    ...(!USE_MOCK_AUTH
      ? [
          Keycloak({
            authorization: {
              params: {
                scope: "openid profile email roles",
                ...(env.AUTH_KEYCLOAK_IDP_HINT && {
                  kc_idp_hint: env.AUTH_KEYCLOAK_IDP_HINT,
                }),
              },
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, profile, user, trigger, session }) {
      if (trigger === "update" && session?.roles) {
        token.roles = session.roles;
      }

      if (user) {
        const userRoles = (user as any).roles;
        token.roles =
          Array.isArray(userRoles) && userRoles.length > 0
            ? userRoles
            : resolveRoles(profile as Record<string, unknown> | undefined);
      }

      if (token.roles && (token.roles as string[]).length > 0 && !token.permissions) {
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
