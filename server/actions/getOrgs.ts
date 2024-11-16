'use server'
import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";

export async function getOrgs() {
  const session = await auth();
  const user = session?.user;
  console.log("user: ", user)
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

    // const orgsList = orgs.map((membership) => membership.organisation);
    // return orgsList;
    return orgs
  } catch (error) {
    console.log(error);
    return error;
  }
}
