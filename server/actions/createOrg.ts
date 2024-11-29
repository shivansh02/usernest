"use server";
import { auth } from "@/server/auth";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/server/prisma";
import { newOrgSchema } from "@/types/newOrgSchema";
import { Role } from "@prisma/client";

export const CreateOrg = actionClient
  .schema(newOrgSchema)
  .action(async ({ parsedInput: { name, desc } }) => {
    const session = await auth();
    const user = session?.user;
    const newInvite = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user || !user.email) return { failure: "user not logged in" };

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!existingUser) return { failure: "user email not found" };

      // Create a new organization
      const newOrg = await prisma.organisation.create({
        data: {
          name: name,
          desc: desc,
          creatorId: existingUser.id,
          inviteCode: newInvite,
        },
      });

      // Assign the user as an ADMIN in the organization
      await prisma.membership.create({
        data: {
          userId: existingUser.id,
          organisationId: newOrg.id,
          role: "ADMIN",
        },
      });

      // Fetch all permissions from the Permission table
      const allPermissions = await prisma.permission.findMany();

      // Map permissions to RolePermission entries for the ADMIN role
      const adminPermissions = allPermissions.map((permission) => ({
        organisationId: newOrg.id,
        role: Role.ADMIN,
        permissionId: permission.id,
      }));

      // Insert all permissions for ADMIN role
      await prisma.rolePermission.createMany({
        data: adminPermissions,
      });

      return { success: newOrg };
    } catch (error) {
      console.log("Error creating organization:", error);
      return { failure: "An error occurred while creating the organization" };
    }
  });
