"use server";
import { prisma } from "@/server/prisma";
import getBaseUrl from "@/lib/baseURL";
import { Resend } from "resend";

export const getVerificationToken = async (email: string) => {
  try {
    const token = await prisma.verificationToken.findFirst({
      where: {
        email: email,
      },
    });

    if (token) {
      return { token };
    }
  } catch (error) {
    return null;
  }
};

export const getPasswordResetToken = async (email: string) => {
  try {
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        email: email,
      },
    });

    if (token) {
      return { token };
    }
  } catch (error) {
    return null;
  }
};
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: token,
      },
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
export const generateVerificationToken = async (email: string) => {
  const id = crypto.randomUUID();
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationToken(email);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.token.id,
      },
    });
  }
  const verificationToken = await prisma.verificationToken.create({
    data: {
      token: token,
      expires: expires,
      email: email,
      id: id,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const id = crypto.randomUUID();
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetToken(email);
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.token.id,
      },
    });
  }
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      token: token,
      expires: expires,
      email: email,
      id: id,
    },
  });

  return passwordResetToken;
};

const resend = new Resend(process.env.RESEND_KEY);
const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verification-token?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Verification <usernest@shivansh.space>",
    to: email,
    subject: "Usernest Verification Email",
    html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,
  });
  if (data) return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/reset-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Verification <usernest@shivansh.space>",
    to: email,
    subject: "Usernest Password Reset Email",
    html: `<p>Click to <a href='${confirmLink}'>reset your password</a></p>`,
  });
  if (error) return { success: false, error: "Error sending reset email" };
  return {
    success: true,
    message: "Verification email sent to your registered email.",
  };
};

export const verifyToken = async (token: string) => {
  const existingToken = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!existingToken) return { success: false, message: "Invalid token" };
  if (existingToken.expires < new Date())
    return { success: false, message: "Token expired" };

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) return { success: false, message: "Email not registered" };

  await prisma.user.update({
    data: { emailVerified: new Date() },
    where: { email: existingUser.email },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: true, message: "Token verified successfully" };
};
