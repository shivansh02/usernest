"use server"
import { prisma } from "@/server/prisma";

export async function DeleteMembership(userId: string, organisationId: string) {
  try {
    await prisma.membership.delete({
      where: {
        userId_organisationId: {
          userId: userId,
          organisationId: organisationId,
        },
      },
    });
    console.log("deleted membership")
    return { success: "membership deleted successfully" };
  } catch (error) {
    console.log(error)
    return { failure: "failed to delete membership" };
  }
}
