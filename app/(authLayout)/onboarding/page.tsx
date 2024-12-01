"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateOrgForm from "./_components/createOrgForm";
import JoinOrgForm from "./_components/joinOrgForm";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Button
        onClick={async () => {
          await signOut();
        }}
        variant={"ghost"}
        className="absolute right-4 top-4 md:right-8 md:top-8"
      >
        Sign Out
      </Button>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Usernest
          </h1>
          <p className="text-gray-600 text-sm">
            You can choose to either join an existing Organisation or create a
            new one.
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
  );
}
