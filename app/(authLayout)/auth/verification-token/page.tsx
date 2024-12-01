"use client";
import { verifyToken } from "@/server/actions/auth/tokens";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TokenVerificationPage() {
  const [token, setToken] = useState<string | null>(null);
  const Router = useRouter();

  const [status, setStatus] = useState<string>("verifying");
  if (!token) {
    return <p>No verification token found.</p>;
  }

  const verify = async () => {
    const data = await verifyToken(token);
    if (data.success) {
      setStatus("verified");
      setTimeout(() => {
        Router.push("/auth/login");
      }, 2000);
    } else if (data.success === false) {
      setStatus("error");
    }
  };
  const urlParams = new URLSearchParams(window.location.search);
  setToken(urlParams.get("token"));

  verify();

  return (
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
  );
}
