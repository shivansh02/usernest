"use server";
import { ForgotPassSchema } from "@/types/forgotPassSchema";
import { actionClient } from "@/lib/safeAction";
import { prisma } from "@/server/prisma";
import bcrypt from "bcryptjs";
import { generatePasswordResetToken, sendPasswordResetEmail } from "./tokens";

export const ForgotPassword = actionClient
  .schema(ForgotPassSchema)
  .action(async ({ parsedInput: { email } }) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      if (!user.emailVerified) {
        return { failure: "User email not verified" };
      }

      const passwordResetToken = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(email, passwordResetToken.token);

      return { success: "Password reset email sent" };
    }

    return { failure: "User does not exist" };
  });
