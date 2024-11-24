import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
export type ExtendUser = DefaultSession["user"] & {
  id: string;
  isOAuth: boolean;
  image: string | null;
  orgId: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    user: ExtendUser;
  }
}
