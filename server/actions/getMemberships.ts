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
  userId: string
): Promise<GetMembershipsResponse> {
  console.log("Getting memberships for user", userId);
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
