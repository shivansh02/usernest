"use server";
import { auth } from "@/server/auth";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/server/prisma";
import { orgInvite } from "@/types/newOrgSchema";

export const JoinOrg = actionClient
  .schema(orgInvite)
  .action(async ({ parsedInput: { code } }) => {
    const session = await auth();
    const user = session?.user;
    if (!user || !user.email) return { failure: "user not logged in" };

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!existingUser) return { failure: "user email not found" };

      const organisation = await prisma.organisation.findUnique({
        where: {
          inviteCode: code,
        },
      });
      if (!organisation) return { failure: "organisation not found" };

      const newMember = await prisma.membership.create({
        data: {
          organisationId: organisation.id,
          userId: existingUser.id,
          role: 'USER'
        },
      });
      console.log(newMember);
      return { success: "Organisation joined successfully." };

    } catch (error) {
      console.log(error);
    }
  });
