import * as z from 'zod'

export const ForgotPassSchema = z.object({
    email: z.string().email(),
})

export const ResetPassSchema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})