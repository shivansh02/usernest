"use client"
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
    Users,
    User,
    Menu,
    X,
    ChevronsUpDown,
    Moon,
  } from "lucide-react";
  import { OrgCombo } from "@/components/ui/org-combo";
  import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
  import { auth } from "@/server/auth";
  import { useTheme } from "next-themes";
  import {signOut} from "@/server/auth"

export function UserAvatar(user: any) {
    
    return (
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
                <DropdownMenuItem onClick={()=> {signOut()}}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
    )
}