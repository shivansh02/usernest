"use client";
import * as React from "react";
import { useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { getOrgs } from "@/server/actions/orgs/getOrgs";
import { getPermsById } from "@/server/actions/membership/getPermsInOrg";

interface OrgComboProps {
  session: Session;
}

export interface Organisation {
  role: string;
  organisation: {
    id: string;
    name: string;
    inviteCode: string | null;
    desc: string;
  };
}

interface Session {
  expires: string;
  user: {
    email?: string | null | undefined;
    id: string;
    image?: string | null | undefined;
    isOAuth: boolean;
    name: string;
    orgId: string;
    perms: string[];
  };
}

interface ComboboxProps {
  userSession: any,
  orgs: Organisation[]
}

export function OrgCombo({ userSession, orgs }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { update } = useSession();
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {userSession?.user.orgId
            ? orgs.find(
                (org) =>
                  org.organisation.id === userSession?.user.orgId,
              )?.organisation.name
            : "Select Organisation"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search organisation..." /> */}
          <CommandList>
            <CommandEmpty>No organisation found</CommandEmpty>
            <CommandGroup>
              {orgs.map((org) => (
                <CommandItem
                  key={org.organisation.id}
                  value={org.organisation.id}
                  className={cn(
                    "cursor-pointer",
                    userSession?.user.orgId === org.organisation.id
                      ? " font-semibold"
                      : "text-secondary-foreground font-thin",
                  )}
                  onSelect={async (currentValue: any) => {
                    await update({
                      user: {
                        ...userSession!.user,
                        orgId: currentValue,
                        perms: await getPermsById(
                          currentValue,
                          userSession!.user.id,
                        ),
                      },
                    });

                    setOpen(false);
                    window.location.replace("/dashboard/");
                  }}
                >
                  {org.organisation.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      userSession?.user.orgId === org.organisation.name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
