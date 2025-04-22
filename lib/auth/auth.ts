import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
      console.log("jwt", token, account);
      if (profile?.roles) {
        token.roles = profile.roles;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("session", session, token);
      if (token?.roles) {
        session.roles = token.roles;
      }
      return session;
    },
    async authorized({ auth }) {
      console.log("authorized", auth);
      return true;
    },
    async signIn(props) {
      console.log("signIn", props);
      return true;
    },
  },
});
