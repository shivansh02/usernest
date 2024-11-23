"use server"
import { prisma } from "@/server/prisma";
import { revalidatePath } from "next/cache";

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
    revalidatePath('/dashboard/user-action');
    return { success: "membership deleted successfully" };
  } catch (error) {
    console.log(error)
    return { failure: "failed to delete membership" };
  }
}
