import { SidebarTrigger } from "@/components/ui/sidebar";
import UsersTable from "./_components/usersTable";
import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";
import {getMyRole } from "@/server/actions/getMyRole";
import NoPermission from "@/components/common/noPermission";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Role = "ADMIN" | "MANAGER" | "USER";

const UserActionPage = async () => {
  const session = await auth();
  const orgId = session?.user.orgId;
  const myRole = await getMyRole(session?.user.id!, orgId!);

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

  
  const perms = session?.user.perms!;

  if(!perms.includes("MANAGE_USERS")) {
    return <NoPermission />;
  }


  return (
    <div className="w-full flex-1">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <h1 className="text-xl">Manage Users</h1>
      </header>
      <div className="p-6">
        <h1 className="my-2 text-xl text-gray-500">Manage users</h1>
        <UsersTable usersData={users} myRole={myRole!}/>
      </div>
    </div>
  );
};

export default UserActionPage;
