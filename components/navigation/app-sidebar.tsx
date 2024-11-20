import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Settings,
  Plus,
  Users,
  User,
  ListCollapse,
  Menu,
  ChartBar,
  X,
  ChevronsUpDown,
  Moon,
} from "lucide-react";
import { OrgCombo } from "@/components/ui/org-combo";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { auth } from "@/server/auth";
import { useTheme } from "next-themes";
import {signOut} from "@/server/auth"
import { UserAvatar } from "../auth/userAvatar";
import Image from "next/image";
import usernestLogo from "@/public/usernest.svg";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Plus, label: "Create or Join Org", href: "/create-org" },
  { icon: ListCollapse, label: "Org Details", href: "/org-details" },
  { icon: Users, label: "Manage Members", href: "/user-action" },
  { icon: Users, label: "View Members", href: "/users" },
  { icon: ChartBar, label: "Analytics", href: "/analytics" },
];

export async function AppSidebar() {
  const session = await auth();
  const user = session?.user;

  return (
    <Sidebar className="border-r bg dark text-foreground">
      <SidebarHeader className="p-6">
        <div className="flex space-x-2">
          <Image src={usernestLogo} alt="Usernest" width={32} height={32} />
        <h1 className="font-bold text-xl my-4 mx-2">usernest</h1>
        </div>
        {/* <h2 className="text-lg font-semibold">My App</h2> */}
        {/* <p className="text-muted-foreground text-sm pl-2 pb-1">Organisation</p> */}
        <OrgCombo />
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        <SidebarMenu>
          <SidebarGroupLabel>Links</SidebarGroupLabel>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild>
                <a href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </a>
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
                    <AvatarImage src={user?.image} alt="@shadcn" />
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
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
