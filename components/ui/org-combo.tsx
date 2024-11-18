"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { getOrgs } from "@/server/actions/getOrgs";
import { getMemberships } from "@/server/actions/getMemberships";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDashboardStore from "@/hooks/useDashboardStore";

interface Organisation {
  id: string;
  name: string;
  role: string;
}

export function OrgCombo() {
  useEffect(() => {
    async function fetchOrgs() {
      const orgs = (await getMemberships()) as Organisation[];
      console.log(orgs);
      setFetchedOrgs(orgs);
    }
    fetchOrgs();
  }, []);

  const [open, setOpen] = React.useState(false);
  const { organisationId, setOrganisationId, setOrganisationName } = useDashboardStore();
  const [fetchedOrgs, setFetchedOrgs] = useState<
    { id: string; name: string; role: string }[]
  >([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {organisationId
            ? fetchedOrgs.find((org) => org.id === organisationId)?.name
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
                  key={org.id}
                  value={org.id}
                  className={cn( organisationId === org.id ? " font-semibold" : "text-black")}
                  onSelect={(currentValue: any) => {
                    setOrganisationId(
                      currentValue
                    );
                    // setOrganisationName(fetchedOrgs.find())
                    setOrganisationName(fetchedOrgs.find((org) => org.id === currentValue)?.name || "");
                    setOpen(false);
                  }}
                >
                  {org.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      organisationId === org.name ? "opacity-100" : "opacity-0"
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
