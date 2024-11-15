import * as z from "zod";

export const newOrgSchema = z.object({
    name: z.string().min(2).max(30),
    desc: z.string().min(2).max(30),
    
});

export const orgInvite = z.object({
    code: z.string().min(6).max(6)
})