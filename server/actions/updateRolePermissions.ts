"use server";
import { prisma } from "@/server/prisma";
import { revalidatePath } from "next/cache";

type Role = "ADMIN" | "MANAGER" | "USER";

export async function updateRolePermissions(
  organisationId: string,
  role: Role,
  permissions: string[]
) {

  // Delete all existing permissions for the role
  try {
    await prisma.rolePermission.deleteMany({
      where: {
        organisationId,
        role,
      },
    });

    // Insert new permissions
    const newRolePermissions = permissions.map((permission) => {
      return {
        organisationId,
        role: role,
        permissionId: permission,
      };
    });

    await prisma.rolePermission.createMany({
      data: newRolePermissions,
    });
    revalidatePath("/dashboard/rbac");
    return { success: "Role permissions updated successfully" };
  } catch (error) {
    console.log("Error updating role permissions:", error);
  }
}
