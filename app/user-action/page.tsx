"use client";

import * as React from "react";
import { useEffect, useState } from "react";
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
import { ArrowUpDown, ChevronDown, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetUsersByOrg } from "@/server/actions/getUsersByOrg";
import useDashboardStore from "@/hooks/useDashboardStore";
import { changeRole } from "@/server/actions/changeRole";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteMembership } from "@/server/actions/deleteMembership";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NoPermission from "@/components/common/noPermission";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type Role = "ADMIN" | "MANAGER" | "USER";

export default function UserTable() {
  const { organisationId, organisationName, perms } = useDashboardStore();
  useEffect(() => {
    async function fetchUsers() {
      if (organisationId) {
        const users = (await GetUsersByOrg(organisationId)) as User[];
        setusers(users);
        setLoading(false);
      }
    }
    if (perms.length === 0) return;
    const permsArray = perms.map((perm) => perm.name);
    console.log("perms in useraction: ", permsArray);
    if (!permsArray.includes("MANAGE_USERS")) {
      setError("You do not have permission to view this page");
      setLoading(false);
      return;
    } else {
      setError(null);
      fetchUsers();
      console.log("users: ", users);
    }
  }, [perms, organisationId]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [users, setusers] = useState<User[]>([]);

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
            value={user.role}
            onValueChange={async (newRole: Role) => {
              console.log(`Role updated for ${user.name}:`, newRole);
              if (organisationId) {
                console.log(user, organisationId, newRole);
                const success = await changeRole(
                  user.id,
                  organisationId,
                  newRole
                );
                console.log("success:::", success);
                if (success) {
                  setusers((prevUsers) =>
                    prevUsers.map((u) =>
                      u.id === user.id ? { ...u, role: newRole } : u
                    )
                  );
                }
              } else {
                console.log("No organisation selected!!");
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a role">{user.role}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="USER">User</SelectItem>
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
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={async () => {
              console.log("delete button hit");
              if (organisationId) {
                console.log("org exists");
                const success = await DeleteMembership(user.id, organisationId);
                if (success) {
                  setusers((prevUsers) =>
                    prevUsers.filter((u) => u.id !== user.id)
                  );
                }
              }
            }}
          >
            {/* <span className="sr-only">Open menu</span> */}
            <Trash />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (error) {
    return <NoPermission />;
  }

  if (loading) {
    return <div>Loading getting data n all</div>;
  }
  return (
    <div className="w-full flex-1">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <h1 className="text-xl">{organisationName}</h1>
      </header>
      <div className="p-6">
        <h1 className="my-2 text-xl text-gray-500">Manage users</h1>
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
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                              header.getContext()
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
                          cell.getContext()
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
