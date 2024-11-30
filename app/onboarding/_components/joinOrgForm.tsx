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
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function JoinOrgForm() {
  const { execute, result, hasSucceeded } = useAction(JoinOrg, {});
  const router = useRouter();

  async function handleJoinSubmit(values: z.infer<typeof orgInvite>) {
    execute(values);
    router.push("/dashboard");
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
        <Button type="submit" className="w-full">
          Join organisation
        </Button>
      </form>
    </Form>
  );
}
