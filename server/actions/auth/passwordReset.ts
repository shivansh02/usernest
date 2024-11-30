"use server";
import { ResetPassSchema } from "@/types/forgotPassSchema";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/server/prisma";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken, sendPasswordResetEmail } from "./tokens";
import { z } from "zod";

const ResetPassWithTokenSchema = ResetPassSchema.extend({
  token: z.string(),
});

export const PasswordReset = actionClient
  .schema(ResetPassWithTokenSchema)
  .action(async ({ parsedInput: { password, confirmPassword, token } }) => {
    if (!password || !confirmPassword || !token) {
      return { failure: "Invalid input" };
    }

    const passwordResetToken = await getPasswordResetTokenByToken(token);
    if (!passwordResetToken) {
      return { failure: "Invalid token" };
    }

    const expired =
      new Date(passwordResetToken.expires).getTime() < new Date().getTime();
    if (expired) {
      return { failure: "Token expired" };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: passwordResetToken.email,
      },
    });
    if (!user) {
      return { failure: "User does not exist" };
    }

    const hashedP = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedP,
      },
    });
    await prisma.passwordResetToken.delete({
      where: {
        id: passwordResetToken.id,
      },
    });

    return { success: "Password reset" };
  });
