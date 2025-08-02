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
    permissions: Permission[]; //we currently cannot fill
    // as its not possible to call the get permissions function
    // in the jwt callback
  }
}
