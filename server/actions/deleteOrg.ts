"use server";

import { prisma } from "@/server/prisma";
import {auth } from "@/server/auth";

export async function deleteOrganization(organizationId: string) {
    const session = await auth();
    const user = session?.user;
    const memberships = await prisma.membership.findMany({
        where: {
            userId: user?.id,
        },
        include: {
            organisation: {
                select: {
                    id: true,
                },
            }
        }
    });
    const orgs = memberships.map((membership:any) => membership.organisation.id);
    const newOrgId = orgs[0].id;


  try {
    await prisma.organisation.delete({
      where: {
        id: organizationId,
      },
    });
    console.log(`Deleting organization with ID: ${organizationId}`);
    
    // window.location.reload();
    return { success: true, message: "Organization deleted successfully", newOrgId: newOrgId };
  } catch (error) {
    throw new Error(`Failed to delete organization: ${error}`);
  }
}
