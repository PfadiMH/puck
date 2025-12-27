import { User } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      roles: string[];
      permissions: Permission[];
    } & User;
  }
  interface Profile {
    roles: string[];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    roles: string[];
    permissions: Permission[];
  }
}
