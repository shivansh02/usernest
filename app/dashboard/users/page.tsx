// "use client";
// import { User, columns } from "./columns";
// import { DataTable } from "./data-table";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/navigation/app-sidebar";
// import useDashboardStore from "@/hooks/useDashboardStore";
// import { useEffect, useState } from "react";
// import { GetUsersByOrg } from "@/server/actions/getUsersByOrg";

// // interface User {
// //   id: string;
// //   name: string;
// //   email: string;
// // }

// export default function UsersListPage() {

//   const { organisationId, organisationName } = useDashboardStore();

//   const [users, setusers] = useState<
//     {email: string; name: string; role: string }[]
//   >([]);

//   useEffect(() => {
//     async function fetchOrgs() {
//       if (organisationId) {
//         const users = (await GetUsersByOrg(organisationId)) as User[];
//         console.log(users);
//         setusers(users);
//       }
//     }
//     fetchOrgs();
//   }, [organisationId]);

//   return (
//       <div className="flex-1">
//         <header className="flex h-16 items-center gap-4 border-b px-6">
//           <SidebarTrigger />
//           <h1 className="text-xl">{organisationName}</h1>
//         </header>
//         <main className="flex-1 p-6">
//           <h1 className="my-2 text-xl text-gray-500">Users in your organisation</h1>
//           <DataTable columns={columns} data={users} />
//         </main>
//       </div>
//   );

// }

"use client";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useCallback, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import CountUp from "react-countup";
import { RegenerateInvite } from "@/server/actions/regenerateInvite";
import { EditOrgDetails } from "@/server/actions/editOrgDetails";
import { GetOrgDetails } from "@/server/actions/getOrgDetails";

import {
  BarChart,
  Users,
  ShieldCheck,
  Crown,
  Calendar,
  Pencil,
  Copy,
  RefreshCw,
  CalendarCheck2,
  Trash,
} from "lucide-react";
import useDashboardStore from "@/hooks/useDashboardStore";
import { GetUsersByOrg } from "@/server/actions/getUsersByOrg";

export default function OrganizationDashboard() {
  interface OrgDetails {
    orgDetails: {
      id: string;
      name: string;
      desc: string;
      inviteCode: string;
      createdAt: string;
      updatedAt: string;
      creator: {
        name: string;
      };
    };
    users: number;
    managers: number;
    admins: number;
  }

  const [orgData, setOrgData] = useState<OrgDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const { toast } = useToast();
  const { organisationId, perms } = useDashboardStore();

  const [users, setusers] = useState<
    { email: string; name: string; role: string }[]
  >([]);

  useEffect(() => {
    async function fetchOrgs() {
      if (organisationId) {
        const users = (await GetUsersByOrg(organisationId)) as User[];
        console.log(users);
        setusers(users);
      }
    }
    fetchOrgs();
  }, [organisationId]);

  useEffect(() => {
    const fetchOrgDetails = async () => {
      if (!organisationId) {
        console.log("No organisation ID found");
        return;
      }

      const res = await GetOrgDetails(organisationId);
      setOrgData(res);
      setEditedName(res.orgDetails.name);
      setEditedDescription(res.orgDetails.desc);
    };
    fetchOrgDetails();
  }, [organisationId]);

  if (!orgData) {
    return <div>Loading...</div>;
  }

  const totalMembers = orgData.users + orgData.managers + orgData.admins;

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback>
              {orgData.orgDetails.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-2xl">
              {orgData.orgDetails.name}
            </CardTitle>
            <CardDescription className="mt-2 max-w-2xl">
              {orgData.orgDetails.desc}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm mb-2">
              Created by: {orgData.orgDetails.creator.name}
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">
                  Member Composition
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    Users:{" "}
                    {totalMembers
                      ? ((orgData.users / totalMembers) * 100).toFixed(1)
                      : 0}
                    %
                  </Badge>
                  <Badge variant="secondary">
                    Managers:{" "}
                    {totalMembers
                      ? ((orgData.managers / totalMembers) * 100).toFixed(1)
                      : 0}
                    %
                  </Badge>
                  <Badge variant="secondary">
                    Admins:{" "}
                    {totalMembers
                      ? ((orgData.admins / totalMembers) * 100).toFixed(1)
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-semibold">Admin</span>
            </div> */}
            {/* <div className="text-xs text-muted-foreground">
            </div> */}
            <div className="mt-4">
              {perms.map((perm) => (
                <Badge
                  key={perm.id}
                  variant="secondary"
                  className="mr-2 px-4 py-2 rounded-full"
                >
                  {perm.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} />
        </CardContent>
      </Card>
    </div>
  );
}
