"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { JoinOrg } from "@/server/actions/orgs/joinOrg";
import { orgInvite } from "@/types/newOrgSchema";
import { useAction } from "next-safe-action/hooks";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export default function JoinOrgForm() {
  const { toast } = useToast();
  const { execute, result, isExecuting } = useAction(JoinOrg, {});
  useEffect(() => {
    if (result.data?.success) {
      toast({
        title: "Organisation joined successfully",
        description:
          "You can view organisation by switching to it in the sidebar.",
      });
    }
    else if (result.data?.error) {
      toast({
        title: "Organisation not joined",
        description:
          "Please check your invite code and try again.",
      });
    }
  }, [result.data]);

  async function handleJoinSubmit(values: z.infer<typeof orgInvite>) {
    execute(values);
  }

  const form = useForm<z.infer<typeof orgInvite>>({
    resolver: zodResolver(orgInvite),
    defaultValues: {
      code: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleJoinSubmit)}
        className="space-y-4 mt-4"
      >
        <div className="space-y-2">
          <Label htmlFor="invite-code">Invite Code</Label>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter Invite Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className={cn("w-full", isExecuting? "animate-pulse":"")}>
          Join organisation
        </Button>
      </form>
    </Form>
  );
}
