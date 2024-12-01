
import { RegisterForm } from "@/components/auth/registerForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";


export default function SignupPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Link
        href="/auth/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

