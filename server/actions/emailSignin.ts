"use server";
import { LoginSchema } from "@/types/loginSchema";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/server/prisma";
import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

import bcrypt from "bcrypt";

export const EmailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        redirectTo: "/",
      });

      return { success: "User Signed In!" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Email or Password Incorrect" };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }

    // // return {
    // //     success: "Successfully logged in"
    // // }
    // console.log("sign in triggered");
    // try {
    //   const user = await prisma.user.findUnique({
    //     where: {
    //       email: email,
    //     },
    //   });
    //   if (!user) {
    //     return { failure: "User not found" };
    //   }

    // //   const matchPassword = bcrypt.compare(user.password, password);

    // //   if (!matchPassword) {
    // //     return { failure: "Incorrect password" };
    // //   }

    //   //handle if email not verified

    //   await signIn("credentials", {
    //     email,
    //     password,
    //     redirectTo: "/",
    //   });

    //   // console.log(email, password)
    //   return { success: "User signed in" };
    // } catch (error) {
    //   console.log(error);
    //   if (error instanceof AuthError) {
    //     switch (error.type) {
    //       case "CredentialsSignin":
    //         return { error: "Email or Password Incorrect" };
    //       case "AccessDenied":
    //         return { error: error.message };
    //       case "OAuthSignInError":
    //         return { error: error.message };
    //       default:
    //         return { error: "Something went wrong" };
    //     }
    //   }
    //   if (isRedirectError(error)) {
    //     throw error;
    //   }
    // }
  });
