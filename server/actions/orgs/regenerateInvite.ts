"use server";
import { prisma } from "@/server/prisma";

export async function RegenerateInvite(
  organisationId: string,
  inviteCode: string,
) {
  try {
    await prisma.organisation.update({
      where: {
        id: organisationId,
      },
      data: {
        inviteCode: inviteCode,
      },
    });
    return { success: "invite regenerated successfully" };
  } catch (error) {
    return { failure: "failed to regenerate invite" };
  }
}
