"use server";
import { prisma } from "@/server/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteMembership(userId: string, organisationId: string) {
  try {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organisationId: {
          userId: userId,
          organisationId: organisationId,
        },
      },
      include: {
        user: true,
        organisation: true,
      },
    });
    if (membership?.user.id == membership?.organisation.creatorId) {
      throw new Error("Cannot kick organisation owner");
    }
    await prisma.membership.delete({
      where: {
        userId_organisationId: {
          userId: userId,
          organisationId: organisationId,
        },
      },
    });
    revalidatePath("/dashboard/manage-users");
    return { success: "membership deleted successfully" };
  } catch (error) {
    return { failure: "failed to delete membership" };
  }
}
