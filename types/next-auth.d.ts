import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role?: "USER" | "ADMIN";
    passwordHash?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role?: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: "USER" | "ADMIN";
  }
}

// ensure this file is treated as a module and doesn't pollute globals
export {};
