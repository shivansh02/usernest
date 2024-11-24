"use client";
import * as React from "react";
import { useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { getMemberships } from "@/server/actions/getMemberships";
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

export function OrgCombo() {
  const [open, setOpen] = React.useState(false);

  const { data: session, update } = useSession();
  const orgId = session?.user.orgId;

  const {
    fetchedOrgs,
    setFetchedOrgs,
  } = useDashboardStore();

  useEffect(() => {
    async function fetchOrgs() {
      const orgs = (await getOrgs()) as Organisation[];
      console.log("Orgs", orgs);
      setFetchedOrgs(orgs);
    }
    if (fetchedOrgs.length === 0) fetchOrgs();
  }, []);
  console.log("orgId: ", orgId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {orgId
            ? fetchedOrgs.find(
                (org) => org.organisation.id === orgId
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
              {fetchedOrgs.map((org) => (
                <CommandItem
                  key={org.organisation.id}
                  value={org.organisation.id}
                  className={cn(
                    "cursor-pointer",
                    session?.user.orgId === org.organisation.id
                      ? " font-semibold"
                      : "text-black"
                  )}
                  onSelect={async (currentValue: any) => {
                    // setOrganisationId(currentValue);
                    await update({
                      user: {
                        ...session!.user,
                        orgId: currentValue,
                        perms: await getPermsById(currentValue, session!.user.id),
                      },
                    });
                    // setOrganisationName(
                    //   fetchedOrgs.find(
                    //     (org) => org.organisation.id === currentValue
                    //   )?.organisation.name || ""
                    // );
                    setOpen(false);
                    window.location.replace("/dashboard/details");
                    // setOrganisationName(fetchedOrgs.find())
                  }}
                >
                  {org.organisation.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      orgId === org.organisation.name
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
