"use client";

import { ForgotPasswordForm } from "@/components/auth/forgotPasswordForm";
import { useEffect, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    if (email) {
      setEmail(email);
    } else {
      setEmail("yourmail@email.com");
    }
  }, []);

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          An email will be sent to you with instructions on how to reset your
          password.
        </p>
      </div>
      {email && <ForgotPasswordForm email={email} />}
    </div>
  );
}
