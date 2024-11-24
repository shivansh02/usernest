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
import { useAction } from "next-safe-action/hooks";
import { ForgotPassSchema } from "@/types/forgotPassSchema";
import { ForgotPassword } from "@/server/actions/forgotPassword";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
}


export function ForgotPasswordForm({ className, email }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  console.log(email);

  const {execute, isExecuting, status, result} = useAction(ForgotPassword, {})

  async function  onSubmit(values: z.infer<typeof ForgotPassSchema>) {
    console.log(values);
    execute(values);
  }

  const form = useForm<z.infer<typeof ForgotPassSchema>>({
    resolver: zodResolver(ForgotPassSchema),
    defaultValues: {
      email: email || "",
    },
  });

  return (
    <div className={cn("grid gap-6", className)}>
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
          <Button type="submit" className={cn('w-full', isExecuting ? 'animate-pulse' : '')}>
            Send Password Reset Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
