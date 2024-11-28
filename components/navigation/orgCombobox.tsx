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
import useDashboardStore, { Organisation } from "@/hooks/useDashboardStore";
import { useSession } from "next-auth/react";
import { getOrgs } from "@/server/actions/getOrgs";
import { getPermsById } from "@/server/actions/getPermsInOrg";

interface OrgComboProps {
  session: Session;
}

interface Session {
  expires: string,
  user: {
    // optional email
    email?: string | null | undefined;
    id: string;
    image?: string | null | undefined;
    isOAuth: boolean;
    name: string;
    orgId: string;
    perms: string[];
  };
}

export function OrgCombo(userSession : any) {
  const [open, setOpen] = React.useState(false);

  const { update } = useSession();
  console.log("userSession", userSession)
  // console.log(session)
  const { fetchedOrgs, setFetchedOrgs } = useDashboardStore();

  useEffect(() => {
    async function fetchOrgs() {
      const orgs = (await getOrgs()) as Organisation[];
      console.log("Orgs", orgs);
      setFetchedOrgs(orgs);
    }
    if (fetchedOrgs.length === 0) fetchOrgs();
  }, []);
  // console.log("orgId: ", userSession?.user.orgId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {userSession?.session.user.orgId
            ? fetchedOrgs.find((org) => org.organisation.id === userSession?.session.user.orgId)
                ?.organisation.name
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
              {fetchedOrgs.map((org) => (
                <CommandItem
                  key={org.organisation.id}
                  value={org.organisation.id}
                  className={cn(
                    "cursor-pointer",
                    userSession?.session.user.orgId === org.organisation.id
                      ? " font-semibold"
                      : "text-secondary-foreground font-thin"
                  )}
                  onSelect={async (currentValue: any) => {
                    await update({
                      user: {
                        ...userSession!.session.user,
                        orgId: currentValue,
                        perms: await getPermsById(
                          currentValue,
                          userSession!.session.user.id
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
                      userSession?.session.user.orgId === org.organisation.name
                        ? "opacity-100"
                        : "opacity-0"
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