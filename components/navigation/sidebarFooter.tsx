"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { SignOutButton } from "./signOutButton";
import { ChevronsUpDown, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User } from "next-auth";

interface AppSidebarFooterProps {
  user: User;
}

const AppSidebarFooter = ({ user }: AppSidebarFooterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="size-8 border-2  rounded-full">
            <AvatarFallback className="flex items-center justify-center mt-1.5">
              <UserIcon className="size-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-0.5 leading-none">
            <span className="font-semibold">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
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
  );
};

export default AppSidebarFooter;
