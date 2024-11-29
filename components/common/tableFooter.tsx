"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type Role = "ADMIN" | "MANAGER" | "USER";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

interface TableFooterProps {
  table: Table<User>;
}

const TableFooter = ({ table }: TableFooterProps) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
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
  );
};

export default TableFooter;
