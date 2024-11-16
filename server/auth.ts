import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/prisma";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/loginSchema";
import bcrypt from "bcryptjs";
import {getUser, getAccount} from "@/server/actions/getUser"
import authConfig from "./auth.config"


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // session: {
  //   strategy: "jwt",
  // },
  // providers: [
  //   Github({
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //     allowDangerousEmailAccountLinking: true,
  //   }),
  //   Credentials({
  //     authorize: async (credentials) => {
  //       const validatedFields = LoginSchema.safeParse(credentials);

  //       if (validatedFields.success) {
  //         const { email, password } = validatedFields.data;

  //         const user = await prisma.user.findUnique({
  //           where: {
  //             email: email,
  //           },
  //         });
  //         if (!user || !user.password) return null;

  //         const passwordMatch = await bcrypt.compare(password, user.password);
  //         if (passwordMatch) return user;
  //       }
  //       return null;
  //     },
  //   }),
  // ],
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      // const existingUser = await prisma.user.findFirst({
      //   where: {
      //     id: token.sub,
      //   },
      // });
      const existingUser = await getUser(token.sub)
      if (!existingUser) return token;
      // const existingAccount = await prisma.account.findFirst({
      //   where: {
      //     userId: existingUser.id,
      //   },
      // });
      const existingAccount = await getAccount(existingUser.id)
      // const existingAccount = await db.query.accounts.findFirst({
      //   where: eq(accounts.userId, existingUser.id),
      // })

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      return token;
    },
  },
  ...authConfig
});
