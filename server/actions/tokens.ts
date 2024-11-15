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


export const verifyToken = async (token: string) => {
    const existingToken = await prisma.verificationToken.findFirst({
        where: {
            token: token
        }
    })
    if(!existingToken) return ({Failure: "Invalid token"})
    if(existingToken.expires < new Date()) return {Failure: "Token expired"}

    const existingUser = await prisma.user.findUnique({
        where: {
            email: existingToken.email
        }
    })
    if(!existingUser) return {Failure: "Email not registered"}

    await prisma.user.update({
        data: {
            emailVerified: new Date()
        },
        where : {
            email: existingUser.email
        }
    })

    await prisma.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    })
}