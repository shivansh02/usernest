"use server";
import { prisma } from "@/server/prisma";

export async function checkOnboarding(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        memberships: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.memberships.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    throw new Error("Error checking onboarding status:");
  }
}
