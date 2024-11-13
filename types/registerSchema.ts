import * as z from 'zod'

export const RegisterSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2, {message: "Name must be atleast 2 characters"}).max(30),
    password: z.string().min(8, {message: "Password must atleast be 8 characters"}).max(20),    
})