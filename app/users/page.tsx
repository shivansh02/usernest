"use client";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import useDashboardStore from "@/hooks/useDashboardStore";
import { useEffect, useState } from "react";
import { GetUsersByOrg } from "@/server/actions/getUsersByOrg";

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

export default function UsersListPage() {
 
  const { organisationId, organisationName } = useDashboardStore();

  const [users, setusers] = useState<
    {email: string; name: string; role: string }[]
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
 
  return (
      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <h1 className="text-xl">{organisationName}</h1>
        </header>
        <main className="flex-1 p-6">
          <DataTable columns={columns} data={users} />
        </main>
      </div>
  );
}
