import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";

declare module "next-auth" {
  interface Session {
    user: {
      roles: string[];
      //permissions: Permission[];
    } & DefaultSession["user"];
  }
  interface Profile {
    roles: string[];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    roles: string[];
    //permissions: Permission[];
  }
}
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
    async jwt({ token, account, profile }) {
      if (profile?.roles) {
        token.roles = profile.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.roles) {
        session.user.roles = token.roles;
      }
      return session;
    },
    async authorized({ auth }) {
      return true;
    },
    async signIn(props) {
      return true;
    },
  },
});

const signInWithKeycloak = () => signIn("keycloak");
export { auth, handlers, signInWithKeycloak as signIn, signOut };
