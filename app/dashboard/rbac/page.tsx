import { SidebarTrigger } from "@/components/ui/sidebar";
import { GetAllPerms } from "@/server/actions/membership/getAllPerms";
import RbacCard from "./_components/rbacCard";
import { auth } from "@/server/auth";
import NoPermission from "@/components/common/noPermission";
import PermissionProvider from "@/components/providers/permissionProvider";

export default async function PermissionManagement() {
  const session = await auth();
  const orgId = session?.user.orgId!;
  const perms = session?.user.perms!;

  const managerPerms = await GetAllPerms(orgId, "MANAGER");
  const managerPermsArray = managerPerms.map((perm) => perm.id);
  const userPerms = await GetAllPerms(orgId, "USER");
  const userPermsArray = userPerms.map((perm) => perm.id);

  return (
    <PermissionProvider permissions={["EDIT_PERMS"]} userPermissions={perms}>
    <div className="flex-1 flex flex-col min-h-screen bg-muted">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
      </header>
      <RbacCard managerPerms={managerPermsArray} userPerms={userPermsArray} />
    </div>
    </PermissionProvider>
  );
}
