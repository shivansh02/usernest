"use client";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import JoinOrgForm from "@/app/onboarding/_joinOrgForm/joinOrgForm";
import CreateOrgForm from "@/app/onboarding/_createOrgForm/createOrgForm";

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
import { newOrgSchema, orgInvite } from "@/types/newOrgSchema";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import BgArt from "@/public/bg-cover.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


import * as React from 'react'
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import useDashboardStore from '@/hooks/useDashboardStore'
import { getOrgs } from "@/server/actions/getOrgs"
import {useEffect } from 'react'
import {useTheme} from 'next-themes';
import { Toggle } from '@/components/ui/toggle'
import { MoonIcon } from 'lucide-react'


export default function OnboardingPage() {
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const {organisationId, organisationName} = useDashboardStore();
  const { theme, setTheme } = useTheme();
  const { execute, isExecuting } = useAction(CreateOrg, {});

  async function handleCreateSubmit(values: z.infer<typeof newOrgSchema>) {
    console.log("handle createsubmit hit");
    execute(values);
  }

  const handleJoinSubmit = (e: React.FormEvent) => {};

  const form = useForm<z.infer<typeof newOrgSchema>>({
    resolver: zodResolver(newOrgSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });
  const joinForm = useForm<z.infer<typeof orgInvite>>({
    resolver: zodResolver(orgInvite),
    defaultValues: {
      code: "",
    },
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className='flex items-center justify-between w-full'>
          <h1 className="font-semibold">{}</h1>

          <Toggle onChange={()=> {setTheme(theme === 'light' ? 'dark' : 'light')}}>
            <MoonIcon />
          </Toggle>
          </div>
        </header>
      <div className="w-full flex-grow flex flex-col justify-center items-center pb-8">
        {/* <Image
          src={BgArt}
          alt="Authentication"
          layout="fill"
        objectFit="cover"
          className="opacity-5"
        /> */}
        <h1 className="text-2xl mb-4">Create or join organisation</h1>
        <Card className=" z-10">
          <CardHeader>
            <CardTitle>Organisation Setup</CardTitle>
            <p className="text-gray-600 text-sm">
              You can choose to either join an existing organisation or create a
              new one.
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create organisation</TabsTrigger>
                <TabsTrigger value="join">Join organisation</TabsTrigger>
              </TabsList>
              <TabsContent value="create">
                <CreateOrgForm />
              </TabsContent>
              <TabsContent value="join">
                <JoinOrgForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
