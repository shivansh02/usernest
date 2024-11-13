"use server";
import { RegisterSchema } from "@/types/registerSchema";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/server/prisma"
import bcrypt from 'bcrypt'
import { generateVerificationToken, sendVerificationEmail } from "./tokens";

export const EmailRegister = actionClient
.schema(RegisterSchema)
.action(async ({parsedInput: {email, name, password} }) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if(user) {
        if(!user.emailVerified) {
            const verificationToken = await generateVerificationToken(email)
            await sendVerificationEmail(email, verificationToken.token)

            return {success: "Verification email sent"}
        }
        return {failure: "User already exists"}
    }

    const hashedP = await bcrypt.hash(password, 10);

    // register new user
    await prisma.user.create({
        data: {
            email: email,
            password: hashedP,
            name: name
        }
    })
    
    console.log({email, name, password})
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(email, verificationToken.token)

    return {success: "Verification email sent"}
});