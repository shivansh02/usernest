"use server";
import { RegisterSchema } from "@/types/registerSchema";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/server/prisma";
import bcrypt from "bcryptjs";
import { generateVerificationToken, sendVerificationEmail } from "./tokens";

export const EmailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    try {
      // check if the user already exists
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        if (!user.emailVerified) {
          // send verification email for unverified user
          const verificationToken = await generateVerificationToken(email);
          await sendVerificationEmail(email, verificationToken.token);

          return {
            success: true,
            message: "Verification email sent to your registered email.",
          };
        }
        return {
          success: false,
          error: "User already exists and is verified. Try logging-in instead.",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(email, verificationToken.token);

      return {
        success: true,
        message: "Registration successful. Verification email sent.",
      };
    } catch (error) {
      console.error("Error in EmailRegister action:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }
  });
