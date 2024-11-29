"use client";
import Image from "next/image";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateOrgForm from "./_components/createOrgForm";
import JoinOrgForm from "./_components/joinOrgForm";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";


import loginArt from "@/public/loginArt2.png";

export default function OnboardingPage() {
  return (
    <>
      <div className="container relative grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 px-4">
        <Button
          onClick={async () => {
            await signOut();
          }}
          variant={"ghost"}
          className="absolute right-4 top-4 md:right-8 md:top-8"
        >
          Sign Out
        </Button>

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900">
            <Image
              src={loginArt}
              alt="Authentication"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-2xl font-bold">Usernest</span>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Hands down the best user management software in the
                segment, 10x-ed our speed.&rdquo;
              </p>
              <footer className="text-sm">Someone</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome to Usernest
              </h1>
              <p className="text-gray-600 text-sm">
                You can choose to either join an existing Organisation or create
                a new one.
              </p>
            </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
