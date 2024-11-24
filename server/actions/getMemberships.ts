"use server";
import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";
import { $Enums } from "@prisma/client";

interface GetMembershipsResponse {
  orglist: {
    id: string;
    name: string;
    role: $Enums.Role;
  }[];
}

export async function getMemberships(
  userId: string
): Promise<GetMembershipsResponse> {
  try {
    const orgs = await prisma.membership.findMany({
      where: {
        userId: userId,
      },
      select: {
        organisation: {
          select: {
            id: true,
            name: true,
          },
        },
        role: true,
      },
    });

    const orgsList = orgs.map((membership) => ({
      id: membership.organisation.id,
      name: membership.organisation.name,
      role: membership.role,
    }));
    return { orglist: orgsList };
    // return orgs
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch organisations: ${error}`);
  }
}
