"use server";
import { auth } from "@/server/auth";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/server/prisma";
import { orgInvite } from "@/types/newOrgSchema";
import { revalidatePath } from "next/cache";

export const JoinOrg = actionClient
  .schema(orgInvite)
  .action(async ({ parsedInput: { code } }) => {
    const session = await auth();
    const user = session?.user;
    if (!user || !user.email) return { error: "User not logged in" };

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!existingUser) return { error: "User email not found" };

      const organisation = await prisma.organisation.findUnique({
        where: {
          inviteCode: code,
        },
      });
      if (!organisation) return { error: "Organisation not found!" };

      const newMember = await prisma.membership.create({
        data: {
          organisationId: organisation.id,
          userId: existingUser.id,
          role: "USER",
        },
      });
      revalidatePath("/dashboard", "layout");
      return { success: "Organisation joined successfully." };
    } catch (error) {
      return { error: "Failed to join organisation." };
    }
  });
