"use server";
import { LoginSchema } from "@/types/loginSchema";
import { actionClient } from "@/lib/safe-action";
import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";
import { checkOnboarding } from "@/server/actions/checkOnboarding";
import { redirect } from "next/navigation";

export const EmailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // Check if user needs onboarding
      const isOnboarded = await checkOnboarding(email);

      if (!isOnboarded) {
        redirect("/authonboarding");
      }

      redirect("/dashboard/");
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { success: false, error: "Email or Password Incorrect" };
          case "AccessDenied":
            return { success: false, error: error.message };
          case "OAuthSignInError":
            return { success: false, error: error.message };
          default:
            return { success: false, error: "Something went wrong" };
        }
      }
      throw error;
    }
  });
