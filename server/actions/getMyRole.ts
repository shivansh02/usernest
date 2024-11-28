'use server'
import { prisma } from "@/server/prisma";

export async function getMyRole (userId: string, organisationId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organisationId: {
        userId,
        organisationId,
      },
    },
    select: {
      role: true,
    },
  });

  return membership?.role;
}