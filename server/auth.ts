import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/prisma";
import { getUser, getAccount } from "@/server/actions/getUser";
import authConfig from "./auth.config";
import { getMemberships } from "./actions/getMemberships";

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
        };
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      if (user) {
        if (trigger === "signIn" || !token.user.orgId) {
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
        }
      }

      return token;
    },
  },
  ...authConfig,
});

// jwt: async ({ token, user, trigger, session }) => {
//   if (trigger === "update" && session) {
//     console.log("Trigger", trigger);
//     token = { ...token, ...session };
//     console.log("Token after update", token);
//   }
//   if (user) {
//     console.log("USER", user);
//     if (trigger === "signIn" || !token.tenant || !token.workspace) {
//       console.log("Trigger", trigger);
//       token.role = user.role;
//       const tenants = await getTenants();
//       if (tenants.data.length > 0) {
//         const firstTenantId = tenants.data[0].id;
//         token.tenant = firstTenantId;
//         const workspaces = await getWorkspaces(firstTenantId);
//         token.workspace =
//           workspaces.data.length > 0 ? workspaces.data[0].id : "";
//       } else {
//         token.tenant = "";
//         token.workspace = "";
//       }
//     }
//   }
//   return token;
// },
