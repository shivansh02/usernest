import * as z from "zod";

export const newOrgSchema = z.object({
    name: z.string().min(2).max(30),
    desc: z.string().min(2).max(30),
    
});
