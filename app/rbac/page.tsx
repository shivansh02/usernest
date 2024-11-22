"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useDashboardStore from "@/hooks/useDashboardStore";
import { GetAllPerms } from "@/server/actions/getAllPerms";
import { updateRolePermissions } from "@/server/actions/updateRolePermissions";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const permissions = [
  { id: "cm3qa0dpe0000192hclezlkhx", name: "View Users" },
  { id: "cm3qa0u160001192hx0wf08p4", name: "Manage Users" },
  { id: "cm3qwvbw40004192h7cvs5gnh", name: "View Analytics" },
];

export default function PermissionManagement() {
  const [loading, setLoading] = useState(true);
  const { organisationName, organisationId } = useDashboardStore();

  useEffect(() => {
    async function fetchPerms() {
      if (!organisationId) return;
      const managerPerms = await GetAllPerms(organisationId, "MANAGER");
      const userPerms = await GetAllPerms(organisationId, "USER");
      setManagerPermissions(managerPerms.map((perm) => perm.id));
      setUserPermissions(userPerms.map((perm) => perm.id));
      console.log("Manager Permissions:", managerPerms);
      console.log("User Permissions:", userPerms);
      setLoading(false);
    }

    fetchPerms();
  }, [organisationId]);
  const [managerPermissions, setManagerPermissions] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = () => {
    console.log("Manager Permissions:", managerPermissions);
    console.log("User Permissions:", userPermissions);
    toast({
      title: "Permissions Updated",
      description: "Permissions have been successfully updated",
    });
    if (!organisationId) {
      console.log("Organisation ID not found");
      return;
    }
    updateRolePermissions(organisationId, "MANAGER", managerPermissions);
    updateRolePermissions(organisationId, "USER", userPermissions);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <h1 className="text-xl">{organisationName}</h1>
      </header>
      <Card className="w-full md:w-1/2 mx-auto my-auto">
        <CardHeader>
          <CardTitle>Permission Management</CardTitle>
          <CardDescription>
            Manage permissions for Manager and User roles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Manager Permissions</h3>
            <MultiSelect
              options={permissions.map((perm) => ({
                label: perm.name,
                value: perm.id,
              }))}
              onValueChange={setManagerPermissions}
              defaultValue={managerPermissions}
              placeholder="Select manager permissions"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">User Permissions</h3>
            <MultiSelect
              options={permissions.map((perm) => ({
                label: perm.name,
                value: perm.id,
              }))}
              onValueChange={setUserPermissions}
              defaultValue={userPermissions}
              placeholder="Select user permissions"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="ml-auto">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
