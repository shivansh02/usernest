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

// "use server"
// import { prisma } from "@/server/prisma"

// export async function GetOrgDetails(organisationId: string) {
//     // Run queries in parallel using Promise.all
//     const [orgDetails, memberCounts] = await Promise.all([
//         // Query 1: Get organization details
//         prisma.organisation.findUnique({
//             where: {
//                 id: organisationId
//             },
//             include: {
//                 creator: {
//                     select: {
//                         name: true,
//                     }
//                 },
//             }
//         }),
        
//         // Query 2: Get all role counts in a single query
//         prisma.membership.groupBy({
//             by: ['role'],
//             where: {
//                 organisationId: organisationId,
//             },
//             _count: {
//                 role: true
//             }
//         })
//     ]);

//     // Transform the role counts into the expected format
//     const roleCounts = memberCounts.reduce((acc: { [key: string]: number }, curr) => {
//         acc[curr.role.toLowerCase()] = curr._count.role;
//         return acc;
//     }, { users: 0, managers: 0, admins: 0 });

//     return {
//         orgDetails,
//         users: roleCounts.user || 0,
//         managers: roleCounts.manager || 0,
//         admins: roleCounts.admin || 0
//     };
// }