// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: "USER" | "ADMIN";
    id: string;
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
