"use server"
import {prisma} from "@/server/prisma"

export async function GetOrgDetails(organisationId: string) {
    const org = prisma.organisation.findUnique({
        where : {
            id: organisationId
        },
        include : {
            creator: {
                select: {
                    name: true,
                }
            },

        }
    })
    const users = prisma.membership.count({
        where: {
            organisationId: organisationId,
            role: 'USER'

        }
    })
    const managers = prisma.membership.count({
        where: {
            organisationId: organisationId,
            role: 'MANAGER'

        }
    })
    const admins = prisma.membership.count({
        where: {
            organisationId: organisationId,
            role: 'ADMIN'

        }
    })

    const orgDetails = await prisma.$transaction([org, users, managers, admins]) as any 
    return {
        orgDetails: orgDetails[0],
        users: orgDetails[1],
        managers: orgDetails[2],
        admins: orgDetails[3]
    }
}