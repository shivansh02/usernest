"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
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
import { RegisterSchema } from "@/types/registerSchema";
import { useAction } from "next-safe-action/hooks";
import {EmailRegister} from "@/server/actions/emailRegister"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}


export function RegisterForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {execute, isExecuting, result} = useAction(EmailRegister, {})

  async function  onSubmit(values: z.infer<typeof RegisterSchema>) {
    console.log(values);
    execute(values);
  }

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Full Name" {...field}  />
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
          <Button type="submit" className={cn('w-full', isExecuting ? 'animate-pulse' : '')}>
            Register with Email
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
        disabled={isLoading}
      >
        GitHub
      </Button>
      {result.data && (
        <p style={{ color: result.data.success ? "green" : "red" }}>
          {result.data.success ? result.data.message : result.data.error}
        </p>
      )}
    </div>
  );
}
