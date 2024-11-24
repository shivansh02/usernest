"use client"

import { ColumnDef } from "@tanstack/react-table"

export type User = {
  // id: string
  name: string
  email: string
  role: string
}

export const columns: ColumnDef<User>[] = [
  // {
  //   accessorKey: "id",
  //   header: "id",
  // },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
]
