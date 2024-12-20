import { SidebarTrigger } from "@/components/ui/sidebar";
import UsersTable from "./_components/usersTable";
import { prisma } from "@/server/prisma";
import { auth } from "@/server/auth";
import { getMyRole } from "@/server/actions/membership/getMyRole";
import NoPermission from "@/components/common/noPermission";
import PermissionProvider from "@/components/providers/permissionProvider";

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


  return (
    <PermissionProvider permissions={["MANAGE_USERS"]} userPermissions={perms}>
    <div className="w-full flex-1">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <h1 className="text-xl">Manage Members</h1>
      </header>
      <div className="p-6">
        <UsersTable usersData={users} myRole={myRole!} />
      </div>
    </div>
    </PermissionProvider>
  );
};

export default UserActionPage;
