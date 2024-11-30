"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Trash } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { changeRole } from "@/server/actions/membership/changeRole";
import { DeleteMembership } from "@/server/actions/membership/deleteMembership";
import { useSession } from "next-auth/react";
import { Role, User } from "../page";
import FilterSection from "./filterSection";
import TableFooter from "@/components/common/tableFooter";

interface UsersTableProps {
  usersData: User[];
  myRole: Role;
}

const UsersTable = ({ usersData, myRole }: UsersTableProps) => {
  const { data: session } = useSession();
  const orgId = session?.user.orgId;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const checkDisabled = (role: string) => {
    if (
      (myRole === "USER" && role === "ADMIN") ||
      (myRole === "USER" && role === "MANAGER") ||
      (myRole === "MANAGER" && role === "ADMIN")
    ) {
      return true;
    }
    return false;
  };

  const getRoles = (role: Role) => {
    if (role === "ADMIN") {
      return ["MANAGER", "USER", "ADMIN"];
    } else if (role === "MANAGER") {
      return ["USER", "MANAGER"];
    } else {
      return ["USER"];
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Select
            disabled={user.id === session?.user.id || checkDisabled(user.role)}
            value={user.role}
            onValueChange={async (newRole: Role) => {
                const success = await changeRole(user.id, orgId!, newRole);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a role">{user.role}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {getRoles(myRole).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <Button
            disabled={user.id === session?.user.id}
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={async () => {
              if (orgId) {
                const success = await DeleteMembership(user.id, orgId);
              }
            }}
          >
            <Trash />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: usersData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <FilterSection table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TableFooter table={table} />
    </>
  );
};

export default UsersTable;
