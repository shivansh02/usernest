"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateOrg } from "@/server/actions/createOrg";
import { useAction } from "next-safe-action/hooks";
import { newOrgSchema } from "@/types/newOrgSchema";
import * as z from "zod";
import { useRouter } from "next/navigation";
import useDashboardStore from "@/hooks/useDashboardStore";

export default function CreateOrgForm() {
  const { execute, isExecuting, result, status } = useAction(CreateOrg, {});
  const router = useRouter();
  const { setOrganisationId, setOrganisationName } = useDashboardStore();

  async function handleCreateSubmit(values: z.infer<typeof newOrgSchema>) {
    console.log("handle joinsubmit hit");
    execute(values);
    // set organisation id and name if successful
    router.push("/org-details");
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
        <Button type="submit" className="w-full">
          Create organisation
        </Button>
      </form>
    </Form>
  );
}
