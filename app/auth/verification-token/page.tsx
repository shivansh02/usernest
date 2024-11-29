"use client";
import { verifyToken } from "@/server/actions/tokens";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {useState } from "react";
import { Suspense } from "react";

import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import loginArt from "@/public/loginArt2.png";

export default function TokenVerificationPage() {
  const [token, setToken] = useState<string | null>(null);
  const Router = useRouter();
  // const token = useSearchParams().get("token");
  
  const [status, setStatus] = useState<string>("verifying");
  if (!token) {
    return <p>No verification token found.</p>;
  }

  const verify = async () => {
    const data = await verifyToken(token);
    if (data.success) {
      setStatus("verified");
      console.log(status);
      console.log(data);
      setTimeout(() => {
        Router.push("/auth/login");
      }, 2000);
    } else if (data.success === false) {
      setStatus("error");
      console.log(data);
      console.log(status);
    }
  };
  const urlParams = new URLSearchParams(window.location.search);
  setToken(urlParams.get("token"));
  
  verify();

  return (
    <>
      <div className="container relative grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 px-4">
        <Link
          href="/auth/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Sign Up
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900">
            <Image
              src={loginArt}
              alt="Authentication"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-2xl font-bold">Usernest</span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Hands down the best user management software in the
                segment, 10x-ed our speed.&rdquo;
              </p>
              <footer className="text-sm">Someone</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Email Verification
              </h1>
              <h1 className="text-l font-medium tracking-tight">
                Please wait while we verify your token.
              </h1>
              <div className="mt-8 space-y-6">
                {status === "verifying" && (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-gray-500">
                      Verifying your token...
                    </p>
                  </div>
                )}

                {status === "verified" && (
                  <div className="text-center text-green-600">
                    <p className="mt-2 text-base font-medium">
                      Token verified successfully! Redirecting to login page...
                    </p>
                  </div>
                )}

                {status === "error" && (
                  <div className="text-center text-red-600">
                    <p className="mt-2 text-base font-medium">
                      Token verification failed. Please try again.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
