"use client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Plus,
  Users,
  User,
  ListCollapse,
  ChartBar,
  ChevronsUpDown,
  Edit,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import usernestLogo from "@/public/usernest.svg";
import { useState, useEffect } from "react";
import { getPerms2 } from "@/server/actions/getPermsInOrg";
import { useSession } from "next-auth/react";
import useDashboardStore from "@/hooks/useDashboardStore";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { SignOutButton } from "./signOutButton";
import { OrgCombo } from "../ui/org-combo2";

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

export function AppSidebar() {
  // const session = await auth();
  const { data: session } = useSession();
  const user = session?.user;
  const { perms, setPerms, permsOrg, setPermsOrg } = useDashboardStore();
  const [loading, setLoading] = useState(false);

  const orgId = session?.user.orgId!;

  useEffect(() => {
    async function getPerms() {
      setLoading(true);
      const fetchedPerms = await getPerms2(orgId);
      console.log("perms in sidebar: ", fetchedPerms);
      if (Array.isArray(fetchedPerms)) {
        setPerms(fetchedPerms);
        setPermsOrg(orgId);
      } else {
        console.error("Failed to fetch permissions:", fetchedPerms.failure);
      }
      setLoading(false);
    }
    if (perms.length === 0 || permsOrg == null || permsOrg != orgId) getPerms();
  }, [orgId]);

  if (loading) {
    return (
      <Sidebar className="border-r bg dark text-foreground">
        <SidebarHeader className="p-6">
          <div className="flex space-x-2">
            <Image src={usernestLogo} alt="Usernest" width={32} height={32} />
            <h1 className="font-bold text-xl my-4 mx-2">usernest</h1>
          </div>
          {/* <h2 className="text-lg font-semibold">My App</h2> */}
          {/* <p className="text-muted-foreground text-sm pl-2 pb-1">Organisation</p> */}
        </SidebarHeader>
        <SidebarContent className="px-4 py-2">
          <SidebarMenu>
            <SidebarGroupLabel>Links</SidebarGroupLabel>
            <Skeleton className="h-6 mx-2 my-2" />
            <Skeleton className="h-6 mx-2 my-2" />
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Skeleton className="h-8 mx-2 my-2" />
        </SidebarFooter>
      </Sidebar>
    );
  }

  const userPermissions = perms.map((perm) => perm.name);
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 border-2 border-gray-500 rounded-full">
                    {/* <AvatarImage src={user?.image} alt="@shadcn" /> */}
                    <AvatarFallback className="flex items-center justify-center mt-1.5">
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start gap-0.5 leading-none">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width]"
                align="start"
              >
                <DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
