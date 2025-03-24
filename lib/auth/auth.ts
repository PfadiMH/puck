import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/auth",
  providers: [
    Keycloak({
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  callbacks: {
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
