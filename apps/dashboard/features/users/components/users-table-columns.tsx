import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { ActionDropdownUser } from "./ui/action-dropdown-user";

export const usersTableColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="rounded-sm"
      />
    ),
    cell: function CellSelect({ row }) {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          aria-label="Select row"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          disabled={!row.getCanSelect()}
          className="rounded-sm"
        />
      );
    },
  },
  {
    id: "No.",
    header: "No.",
    accessorFn: (_row, index) => index + 1,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;

      if (!role) return "-";
      const roleName =
        typeof role === "object" && role && "name" in (role as object)
          ? (role as { name: string }).name
          : String(role);

      return (
        <Badge
          variant={
            roleName === "admin"
              ? "default"
              : roleName === "manager"
              ? "secondary"
              : "outline"
          }
          className="font-normal uppercase"
        >
          {roleName}
        </Badge>
      );
    },
  },
  {
    id: "action",
    header: () => (
      <div className="flex items-center justify-end">
        <span>Aksi</span>
      </div>
    ),
    cell: ({ row }) => <ActionDropdownUser row={row} />,
  },
];
