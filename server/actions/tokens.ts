"use server";
import { prisma } from "@/server/prisma";
import getBaseUrl from "@/lib/base-url";
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
      id: id
    },
  });

  return verificationToken;
};

const resend = new Resend(process.env.RESEND_KEY);
const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verification-token?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Usernest Verification Email",
    html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,

  });
  if (error) console.log(error);
  if (data) return data;
};
