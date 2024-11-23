"use client"
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateRolePermissions } from "@/server/actions/updateRolePermissions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const permissions = [
  { id: "cm3qa0dpe0000192hclezlkhx", name: "View Users" },
  { id: "cm3qa0u160001192hx0wf08p4", name: "Manage Users" },
  { id: "cm3qwvbw40004192h7cvs5gnh", name: "View Analytics" },
];

interface CardProps {
  managerPerms: string[];
  userPerms: string[];
}

export default function RbacCard({ managerPerms, userPerms }: CardProps) {
  const { toast } = useToast();
  const handleSubmit = () => {
    toast({
      title: "Permissions Updated",
      description: "Permissions have been successfully updated",
    });
    updateRolePermissions("organisationId", "MANAGER", managerPerms);
    updateRolePermissions("organisationId", "USER", userPerms);
  };
  const [managerPermissions, setManagerPermissions] =
    useState<string[]>(managerPerms);
  const [userPermissions, setUserPermissions] = useState<string[]>(userPerms);
  return (
    <>
      <Card className="w-full md:w-1/2 mx-auto my-auto">
        <CardHeader>
          <CardTitle>
            <h1 className="text-lg">Permission Management</h1>
          </CardTitle>
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
    </>
  );
}
