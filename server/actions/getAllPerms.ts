"use server"
import {prisma} from "@/server/prisma";

type Role = "ADMIN" | "MANAGER" | "USER";

export async function GetAllPerms(organisationId: string, role: Role) {
    const permissions = await prisma.rolePermission.findMany({
        where: {
            organisationId,
            role,
        },
        include: {
            permission: 
            {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
    const rolePermissions = permissions.map((perm) => perm.permission);
    return rolePermissions;
}