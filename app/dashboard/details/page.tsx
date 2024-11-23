import { GetOrgDetails } from "@/server/actions/getOrgDetails";
import { OrgHeader } from "./_components/orgHeader";
import { StatsCards } from "./_components/statsCard";
import { OrgDetailsCard } from "./_components/orgDetailsCard";
import { InviteCodeCard } from "./_components/inviteCodeCard";
import { QuickActionsCard } from "./_components/quickActionsCard";
import { RBACPoliciesCard } from "./_components/rbacPoliciesCard";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function OrganizationDashboard() {
  const orgData = await GetOrgDetails("cm3ionqef0001iddgkvufvs4r");

  if (!orgData) {
    return <div>Organization not found</div>;
  }

  const totalMembers = orgData.users + orgData.managers + orgData.admins;

  return (
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
  );
}