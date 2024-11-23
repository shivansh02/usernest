"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { JoinOrg } from "@/server/actions/joinOrg";
import { useAction } from "next-safe-action/hooks";
import { orgInvite } from "@/types/newOrgSchema";
import * as z from "zod";


export default function JoinOrgForm() {
  const { execute, isExecuting } = useAction(JoinOrg, {});

  async function handleJoinSubmit(values: z.infer<typeof orgInvite>) {
    console.log("handle joinsubmit hit");
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
                  <Input
                    placeholder="Enter Invite Code"
                    {...field}
                  />
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
