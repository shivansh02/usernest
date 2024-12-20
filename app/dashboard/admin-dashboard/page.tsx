import { GetOrgDetails } from "@/server/actions/orgs/getOrgDetails";
import { OrgHeader } from "./_components/orgHeader";
import { StatsCards } from "./_components/statsCard";
import { OrgDetailsCard } from "./_components/orgDetailsCard";
import { InviteCodeCard } from "./_components/inviteCodeCard";
import { QuickActionsCard } from "./_components/quickActionsCard";
import { RBACPoliciesCard } from "./_components/rbacPoliciesCard";
import { auth } from "@/server/auth";
import PermissionProvider from "@/components/providers/permissionProvider";

export default async function AdminDashboard() {
  const session = await auth();

  const orgId = session?.user.orgId;

  const perms = session?.user.perms!;

  // if (perms && !perms.includes("VIEW_ADMIN_DASHBOARD")) {
  //   return <NoPermission />;
  // }

  if (!orgId) {
    return (
      <div className="text-gray-300 text-lg mx-auto mt-10">
        Select an organisation from the sidebar!
      </div>
    );
  }

  const orgData = await GetOrgDetails(orgId);

  if (!orgData) {
    return (
      <div className="text-gray-300 text-lg mx-auto mt-10">
        Select an organisation from the sidebar!
      </div>
    );
  }

  const totalMembers = orgData.users + orgData.managers + orgData.admins;

  return (
    <PermissionProvider permissions={["VIEW_ADMIN_DASHBOARD"]} userPermissions={perms}>
    <div className="container mx-auto p-6">
      <OrgHeader organization={orgData.orgDetails} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards
          users={orgData.users}
          managers={orgData.managers}
          admins={orgData.admins}
          totalMembers={totalMembers}
        />
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <OrgDetailsCard
          organization={orgData.orgDetails}
          stats={{
            users: orgData.users,
            managers: orgData.managers,
            admins: orgData.admins,
            totalMembers,
          }}
        />
        <RBACPoliciesCard />
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <InviteCodeCard
          organizationId={orgData.orgDetails.id}
          inviteCode={orgData.orgDetails.inviteCode}
        />
        <QuickActionsCard organizationId={orgData.orgDetails.id} />
      </div>
    </div>
    </PermissionProvider>
  );
}
