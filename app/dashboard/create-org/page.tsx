import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JoinOrgForm from "./_components/joinOrgForm";
import CreateOrgForm from "./_components/createOrgForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function OnboardingPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-muted">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <div className="flex items-center justify-between w-full">
          <h1 className="font-semibold">{}</h1>
        </div>
      </header>
      <div className="w-full flex-grow flex flex-col justify-center items-center pb-8">
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
