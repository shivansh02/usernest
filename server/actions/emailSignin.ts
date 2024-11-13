"use server";
import { LoginSchema } from "@/types/loginSchema";
import { actionClient } from "@/lib/safe-action";
import {prisma } from "@/server/prisma"
import {signIn} from '@/server/auth'

import bcrypt from 'bcrypt'

export const EmailSignIn = actionClient
.schema(LoginSchema)
.action(async ({parsedInput: {email, password} }) => {
    // return {
    //     success: "Successfully logged in"
    // }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(!user) {
            return {failure: "User not found"}
        }
    
        const matchPassword = bcrypt.compare(user.password, password)
    
        if(!matchPassword) {
            return {failure: "Incorrect password"}
        }
    
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/'
        })
    
        console.log(email, password)
        return {email}
    } 
    
    catch(error) {
        console.log(error)
    }
});