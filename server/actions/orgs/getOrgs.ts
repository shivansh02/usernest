"use server";
import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";

export async function getOrgs() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) return { failure: "User not logged in" };

  try {
    const orgs = await prisma.membership.findMany({
      where: {
        userId: user.id,
      },
      select: {
        organisation: {
          select: {
            id: true,
            name: true,
            desc: true,
            inviteCode: true,
          },
        },
        role: true,
      },
    });

    return orgs;
  } catch (error) {
    return error;
  }
}
