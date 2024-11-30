"use server";

import { prisma } from "@/server/prisma";

export async function GetUsersByOrg(orgId: string) {
  const memberships = await prisma.membership.findMany({
    where: {
      organisationId: orgId,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      role: true,
    },
  });
  const users = memberships.map((membership) => ({
    id: membership.user.id,
    email: membership.user.email,
    name: membership.user.name,
    role: membership.role,
  }));

  return users;
}
