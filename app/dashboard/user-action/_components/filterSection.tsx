"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { User } from "../page";

interface FilterSectionProps {
  table: Table<User>;
}

const FilterSection = ({ table }: FilterSectionProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Search user"
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <Select
        onValueChange={(value: any) => {
          console.log("value: ", value);
          if (value === "all") {
            table.getColumn("role")?.setFilterValue(undefined);
          } else {
            table.getColumn("role")?.setFilterValue(value);
          }
        }}
      >
        <SelectTrigger className="w-[180px] ml-4">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="MANAGER">Manager</SelectItem>
          <SelectItem value="USER">User</SelectItem>
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterSection;
