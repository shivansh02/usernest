"use server"
import {prisma} from "@/server/prisma"
import { revalidatePath } from "next/cache";

export  async function EditOrgDetails(organisationId: string, name: string, desc: string){
    try{
        await prisma.organisation.update({
            where: {
                id: organisationId
            },
            data: {
                name: name,
                desc: desc
            }
        })
        console.log("org updated: ", organisationId, name, desc)
        revalidatePath('/dashboard/admin-dashboard');

        return {success: "invite regenerated successfully"}
    }
    catch(error) {
        return {failure: "failed to regenerate invite"}
    }
}