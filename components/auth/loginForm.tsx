"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/types/loginSchema";
import { useAction } from "next-safe-action/hooks";
import { EmailSignIn } from "@/server/actions/auth/emailSignin";
import Link from "next/link";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {

  const { execute, isExecuting, result, status } = useAction(EmailSignIn, {});

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    await execute(values);
  }

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Password" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button variant="link" type="button">
              <Link
                href={`/auth/forgot-password?email=${form.getValues().email}`}
              >
                Forgot Password?
              </Link>
            </Button>
          </div>
          <Button
            type="submit"
            className={cn("w-full", isExecuting ? "animate-pulse" : "")}
          >
            Sign in with Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        onClick={() => {
          signIn("github", {
            redirect: false,
            redirectTo: "/",
          });
        }}
        variant="outline"
        type="button"
        disabled={status==="executing"}
      >
        GitHub
      </Button>
      {result.data && (
        <p className="text-red-500 text-center">{result.data.error}</p>
      )}
    </div>
  );
}
