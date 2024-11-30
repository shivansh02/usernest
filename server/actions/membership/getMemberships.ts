"use server";
import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";

export type Role = "ADMIN" | "MANAGER" | "USER";

interface GetMembershipsResponse {
  orglist: {
    id: string;
    name: string;
    role: Role;
  }[];
}

export async function getMemberships(
  userId: string,
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
  } catch (error) {
    throw new Error(`Failed to fetch organisations: ${error}`);
  }
}
