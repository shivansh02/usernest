"use server";
import { prisma } from "@/server/prisma";
import { revalidatePath } from "next/cache";

type Role = "ADMIN" | "MANAGER" | "USER";

export async function changeRole(
  userId: string,
  organisationId: string,
  role: string
) {
  try {
    const user = await prisma.membership.update({
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
