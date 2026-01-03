
import Credentials from "next-auth/providers/credentials";

export const getMockAuthProvider = () => {
  return Credentials({
    name: "Mock Developer Auth",
    credentials: {
      roles: { label: "Roles", type: "text" },
    },
    authorize: async (credentials: any) => {
      const roles = JSON.parse((credentials.roles as string) || "[]");
      return {
        id: "dev-user",
        name: "Developer",
        email: "dev@example.com",
        roles,
      };
    },
  });
};

