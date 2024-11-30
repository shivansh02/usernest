"use server";
import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";

export async function getPermsById(organisationId: string, userId: string) {

  const permissions = await prisma.permission.findMany({
    where: {
      roles: {
        some: {
          role: {
            in: await prisma.membership
              .findMany({
                where: {
                  userId: userId,
                  organisationId: organisationId,
                },
                select: { role: true },
              })
              .then((memberships) => memberships.map((m) => m.role)),
          },
          organisationId: organisationId,
        },
      },
    },
  });
  const permNames = permissions.map((perm) => perm.name);

  return permNames;
}

export async function getPerms(organisationId: string) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not found");
  }
  const permissions = await prisma.permission.findMany({
    where: {
      roles: {
        some: {
          role: {
            in: await prisma.membership
              .findMany({
                where: {
                  userId: user.id,
                  organisationId: organisationId,
                },
                select: { role: true },
              })
              .then((memberships) => memberships.map((m) => m.role)),
          },
          organisationId: organisationId,
        },
      },
    },
  });

  return permissions;
}
