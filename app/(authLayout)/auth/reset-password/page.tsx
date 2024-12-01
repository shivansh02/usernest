"use client";

import { useAction } from "next-safe-action/hooks";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PasswordReset } from "@/server/actions/auth/passwordReset";
import { ResetPassSchema } from "@/types/forgotPassSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = z.infer<typeof ResetPassSchema>;

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const { execute, isExecuting, hasSucceeded } = useAction(
    PasswordReset,
    {},
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  useEffect(() => {
    if (hasSucceeded) {
      router.push("/auth/login");
    }
  }, [hasSucceeded, router]);

  const form = useForm<FormData>({
    resolver: zodResolver(ResetPassSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    execute({ ...data, token });
    if (hasSucceeded) {
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className={cn("w-full", isExecuting ? "animate-pulse" : "")}
            type="submit"
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
