"use client";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import useDashboardStore from "@/hooks/useDashboardStore";
import { useEffect, useState } from "react";
import { GetUsersByOrg } from "@/server/actions/getUsersByOrg";

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

export default function UsersListPage() {
  const [data, setData] = useState<
    | {
        user: { role: string; name: string | null; email: string };
        role: string;
      }[]
    | undefined
  >(undefined);
  const { organisationId, organisationName } = useDashboardStore();

  const [fetchedOrgs, setFetchedOrgs] = useState<
    {email: string; name: string; role: string }[]
  >([]);

  useEffect(() => {
    async function fetchOrgs() {
      if (organisationId) {
        const users = (await GetUsersByOrg(organisationId)) as User[];
        console.log(users);
        setFetchedOrgs(users);
      }
    }
    fetchOrgs();
  }, [organisationId]);
 
  return (
      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <h1 className="text-xl">{organisationName}</h1>
        </header>
        <main className="flex-1 p-6">
          <DataTable columns={columns} data={fetchedOrgs} />
        </main>
      </div>
  );
}
