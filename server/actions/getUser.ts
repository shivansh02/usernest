import {prisma } from "@/server/prisma"

export async function getUser(tokensub: string) {
    const existingUser = await prisma.user.findFirst({
        where: {
          id: tokensub,
        },
      });
      return existingUser
}

export async function getAccount(userId: string) {
    const existingAccount = await prisma.account.findFirst({
        where: {
          userId: userId,
        },
      });
      return existingAccount
}

