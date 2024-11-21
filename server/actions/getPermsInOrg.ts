"use server";
import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";

// export async function GetPermsInOrg(organisationId: string) {
//   const session = await auth();
//   const user = session?.user;
//   if (!user) {
//     return { failure: "User not found" };
//   }
//   const roleResult = await prisma.membership.findUnique({
//     where: {
//       userId_organisationId: {
//         userId: user.id,
//         organisationId: organisationId,
//       },
//     },
//     select: {
//       role: true,
//     },
//   });

//   console.log("roleResult: ", roleResult);

//   if (!roleResult) {
//     return { failure: "Role not found for user in organisation" };
//   }

//   const perms = await prisma.rolePermission.findMany({
//     where: {
//       organisationId: organisationId,
//       role: roleResult?.role,
//     },
//     include: {
//       permission: true,
//     },
//   });
//   console.log("perms: ", perms);

//   return perms;
// }

export async function getPerms2(organisationId: string) {
    const session = await auth();
  const user = session?.user;
  if (!user) {
    return { failure: "User not found" };
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

  console.log(
    "User's permissions:",
    permissions.map((perm) => perm.name)
  );
  return permissions;
}
