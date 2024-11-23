"use client";
import { User, columns } from "./columns";
import { DataTable } from "./dataTable";
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
import { useToast } from "@/hooks/use-toast";
import { GetOrgDetails } from "@/server/actions/getOrgDetails";

import useDashboardStore from "@/hooks/useDashboardStore";
import { GetUsersByOrg } from "@/server/actions/getUsersByOrg";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { organisationId, perms } = useDashboardStore();
  const [loading, setLoading] = useState(true);

  const [users, setusers] = useState<
    { email: string; name: string; role: string }[]
  >([]);

  // useEffect(() => {
  //   async function fetchOrgs() {
  //     if (organisationId) {
  //       const users = (await GetUsersByOrg(organisationId)) as User[];
  //       console.log(users);
  //       setusers(users);
  //     }
  //   }
  //   fetchOrgs();
  //   setLoading(false);
  // }, [organisationId]);

  useEffect(() => {
    async function fetchData() {
      if (!organisationId) return;
  
      setLoading(true);
  
      try {
        const [usersData, orgDetails] = await Promise.all([
          GetUsersByOrg(organisationId),
          GetOrgDetails(organisationId),
        ]);
  
        setusers(usersData as User[]);
        setOrgData(orgDetails);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); 
      }
    }
  
    fetchData();
  }, [organisationId]);
  

  // useEffect(() => {
  //   const fetchOrgDetails = async () => {
  //     if (!organisationId) {
  //       console.log("No organisation ID found");
  //       return;
  //     }

  //     const res = await GetOrgDetails(organisationId);
  //     setOrgData(res);
  //   };
  //   fetchOrgDetails();
  // }, [organisationId]);

  if (!orgData || loading) {
    return <div className="flex flex-col space-y-10">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>;
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
