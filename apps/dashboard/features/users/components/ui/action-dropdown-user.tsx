"use client";

import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DeleteUserModal } from "./delete-user-modal";
import { EditUserModal } from "./edit-user-modal";

export const ActionDropdownUser = ({ row }: { row: Row<User> }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-8 w-8 p-0" />
        }
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="grid gap-2">
        <DropdownMenuItem>
          <EditUserModal id={row.original.id} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DeleteUserModal id={row.original.id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
