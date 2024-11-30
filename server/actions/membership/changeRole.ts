"use server";
import { prisma } from "@/server/prisma";
import { revalidatePath } from "next/cache";

type Role = "ADMIN" | "MANAGER" | "USER";

export async function changeRole(
  userId: string,
  organisationId: string,
  role: string,
) {
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
      return { failure: "Cannot change role of owner" };
    }
    const updatedUser = await prisma.membership.update({
      where: {
        userId_organisationId: {
          userId: userId,
          organisationId: organisationId,
        },
      },
      data: {
        role: role as Role,
      },
    });
    revalidatePath("/dashboard/manage-users");
    return { success: "Role changed successfully" };
  } catch (error) {
    return { failure: "Role change failed" };
  }
}
