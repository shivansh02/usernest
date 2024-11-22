"use server";
import { auth } from "@/server/auth";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/server/prisma";
import { newOrgSchema } from "@/types/newOrgSchema";

export const CreateOrg = actionClient
  .schema(newOrgSchema)
  .action(async ({ parsedInput: { name, desc } }) => {
    const session = await auth();
    const user = session?.user;
    const newInvite = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user || !user.email) return { failure: "user not logged in" };

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!existingUser) return { failure: "user email not found" };
      const newOrg = await prisma.organisation.create({
        data: {
          name: name,
          desc: desc,
          creatorId: existingUser.id,
          inviteCode: newInvite,
        },
      });
      console.log(newOrg);

      const membership = await prisma.membership.create({
        data: {
          userId: existingUser.id,
          organisationId: newOrg.id,
          role: "ADMIN",
        },
      });
      return { success: newOrg };
    } catch (error) {
      console.log(error);
    }
  });
