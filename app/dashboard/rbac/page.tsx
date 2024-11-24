import { SidebarTrigger } from "@/components/ui/sidebar";
import { GetAllPerms } from "@/server/actions/getAllPerms";
import RbacCard from "./_components/rbacCard";

const permissions = [
  { id: "cm3qa0dpe0000192hclezlkhx", name: "View Users" },
  { id: "cm3qa0u160001192hx0wf08p4", name: "Manage Users" },
  { id: "cm3qwvbw40004192h7cvs5gnh", name: "View Analytics" },
];

export default async function PermissionManagement() {
  // const { organisationName, organisationId } = useDashboardStore();
  const managerPerms = await GetAllPerms("cm3ionqef0001iddgkvufvs4r", "MANAGER");
  const managerPermsArray = (managerPerms.map((perm) => perm.id));
  const userPerms = await GetAllPerms("cm3ionqef0001iddgkvufvs4r", "USER");
  const userPermsArray = (userPerms.map((perm) => perm.id));


  return (
    <div className="flex-1 flex flex-col min-h-screen bg-muted">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        {/* <h1 className="text-xl">{"organisationName"}</h1> */}
      </header>
      <RbacCard managerPerms={managerPermsArray} userPerms={userPermsArray} />
    </div>
  );
}