"use server";

import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";

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
      },
    },
  });
  const orgs = memberships.map((membership: any) => membership.organisation.id);
  var newOrgId = orgs[0];
  if(newOrgId === organizationId) {
    newOrgId = orgs[1];
  }
  try {
    await prisma.organisation.delete({
      where: {
        id: organizationId,
      },
    });
    revalidatePath('/dashboard', 'layout');
    return {
      success: true,
      newOrgId: newOrgId,
    };
  } catch (error) {
    throw new Error(`Failed to delete organization: ${error}`);
  }
}
