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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/hooks/use-toast";
import { CreateOrg } from "@/server/actions/orgs/createOrg";
import { newOrgSchema } from "@/types/newOrgSchema";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { cn } from "@/lib/utils";

export default function CreateOrgForm() {
  const { execute, isExecuting} = useAction(CreateOrg, {});
  const router = useRouter();
  const { toast } = useToast();

  async function handleCreateSubmit(values: z.infer<typeof newOrgSchema>) {
    execute(values);
    router.push("/dashboard");
  }

  const form = useForm<z.infer<typeof newOrgSchema>>({
    resolver: zodResolver(newOrgSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateSubmit)}
        className="space-y-4 mt-4"
      >
        <div className="space-y-2">
          <Label htmlFor="org-name">Organisation Name</Label>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter organisation name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-description">Organisation Description</Label>
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Enter organisation description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
            type="submit"
            className={cn("w-full", isExecuting ? "animate-pulse" : "")}
          >
            Create Organisation
          </Button>
      </form>
    </Form>
  );
}
