import NoPermission from "@/components/common/noPermission";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetOrgDetails } from "@/server/actions/orgs/getOrgDetails";
import { prisma } from "@/server/prisma";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import UsersList from "./usersList";

export default async function UserDashboard() {
  const session = await auth();
  const orgId = session?.user.orgId!;
  const perms = session?.user.perms!;

  if (!perms.includes("VIEW_USER_DASHBOARD")) {
    return <NoPermission />;
  }

  const memberships = await prisma.membership.findMany({
    where: {
      organisationId: orgId,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      role: true,
    },
  });

  const users = memberships.map((membership) => ({
    id: membership.user.id,
    email: membership.user.email,
    name: membership.user.name!,
    role: membership.role,
  }));
  const orgData = await GetOrgDetails(orgId);

  if (!orgId) {
    redirect("/dashboard/create-org");
  }

  const totalMembers = orgData.users + orgData.managers + orgData.admins;

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-stone-900 text-white">
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
            <div className="mt-4">
              {perms.map((perm) => (
                <Badge
                  key={perm}
                  variant="secondary"
                  className="mr-2 mt-1 px-4 py-2 rounded-full"
                >
                  {perm}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="pt-2">Users in this Organisation</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersList usersData={users} />
        </CardContent>
      </Card>
    </div>
  );
}
