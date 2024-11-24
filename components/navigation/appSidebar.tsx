import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, Plus, Users, ListCollapse, ChartBar, Edit } from "lucide-react";
import Image from "next/image";
import usernestLogo from "@/public/usernest.svg";
import { getPerms2 } from "@/server/actions/getPermsInOrg";
import Link from "next/link";
import { OrgCombo } from "./orgCombobox";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import AppSidebarFooter from "./sidebarFooter";

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "/dashboard/details",
    permission: "VIEW_ADMIN_DASHBOARD",
  },
  {
    icon: Plus,
    label: "Create or Join Org",
    href: "/dashboard/create-org",
    permission: null,
  },
  {
    icon: ListCollapse,
    label: "Org Details",
    href: "/dashboard/org-details",
    permission: "VIEW_ORG_DETAILS",
  },
  {
    icon: Users,
    label: "Manage Members",
    href: "/dashboard/user-action",
    permission: "MANAGE_USERS",
  },
  {
    icon: Users,
    label: "View Members",
    href: "/dashboard/users",
    permission: null,
  },
  {
    icon: Edit,
    label: "Edit Permissions",
    href: "/dashboard/rbac",
    permission: "MANAGE_PERMISSIONS",
  },
  {
    icon: ChartBar,
    label: "Analytics",
    href: "/dashboard/analytics",
    permission: "VIEW_ANALYTICS",
  },
];

export async function AppSidebar() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const user = session.user;
  const orgId = session.user.orgId;

  const perms = await getPerms2(orgId);

  const userPermissions = perms.map((perm: {id: string, name: string}) => perm.name);
  const filteredPermissions = menuItems.filter(
    (item) => !item.permission || userPermissions.includes(item.permission)
  );

  return (
    <Sidebar className="border-r bg dark text-foreground">
      <SidebarHeader className="p-6">
        <div className="flex space-x-2">
          <Image src={usernestLogo} alt="Usernest" width={32} height={32} />
          <h1 className="font-bold text-xl my-4 mx-2">usernest</h1>
        </div>
        <OrgCombo />
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        <SidebarMenu>
          <SidebarGroupLabel>Links</SidebarGroupLabel>
          {filteredPermissions.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild>
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <UserAvatar user={user} /> */}
            <AppSidebarFooter user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
