"use server"
import { prisma } from "@/server/prisma";

type Role = "ADMIN" | "MANAGER" | "USER";

export async function updateRolePermissions(organisationId: string, role: Role, permissions: string[]) {
    // Delete all existing permissions for the role
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
}