import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/prisma";
import { getUser, getAccount } from "@/server/actions/membership/getUser";
import authConfig from "./auth.config";
import { getMemberships } from "./actions/membership/getMemberships";
import { getPermsById } from "./actions/membership/getPermsInOrg";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.user.name;
        session.user.email = token.user.email as string;
        session.user.isOAuth = token.user.isOAuth as boolean;
        session.user.image = token.user.image as string;
        session.user.orgId = token.user.orgId as string;
        session.user.perms = token.user.perms as string[];
      }

      console.log("Session", session);

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // Initialize user object if it doesn't exist
      if (!token.user) {
        token.user = {
          id: token.sub || "",
          name: token.name || "",
          email: token.email || "",
          isOAuth: false,
          image: null,
          orgId: "",
          perms: [],
        };
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      if (user) {
        if (trigger === "signIn" || !token.user.orgId || !token.user.perms) {
          if (!token.sub) return token;

          const existingUser = await getUser(token.sub);
          if (!existingUser) return token;

          const existingAccount = await getAccount(existingUser.id);

          token.user = {
            ...token.user,
            isOAuth: !!existingAccount,
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
          };

          const orgs = await getMemberships(existingUser.id);
          if (orgs.orglist && orgs.orglist.length > 0) {
            token.user.orgId = orgs.orglist[0].id;
          } else {
            token.user.orgId = "";
          }
          const perms = await getPermsById(token.user.orgId, existingUser.id);
          if (perms && perms.length > 0) {
            token.user.perms = perms;
          } else {
            token.user.perms = [];
          }
        }
      }

      return token;
    },
  },
  ...authConfig,
});