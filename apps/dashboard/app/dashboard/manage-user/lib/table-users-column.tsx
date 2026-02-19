import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableViewOptions } from "@/components/ui/data-table";
import { Role } from "@/constants";
import { ColumnDef } from "@tanstack/react-table";
import { ActionDropdownUser } from "../_components/ui/action-dropdown-user";

export const tableUsersColumn: ColumnDef<User>[] = [
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
        className="rounded-sm"
      />
    ),
    cell: function CellSelect({ row }) {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          aria-label="Select row"
          onCheckedChange={(value) =>
            row.getCanSelect() && row.toggleSelected(!!value)
          }
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
    enableColumnFilter: false,
  },
  {
    id: "nama",
    accessorKey: "name",
    enableColumnFilter: false,
    header: "Nama",
  },
  {
    id: "NIP",
    accessorKey: "nip",
    enableColumnFilter: false,
    header: "NIP",
  },
  {
    accessorKey: "email",
    enableColumnFilter: false,
    header: "Email",
  },
  {
    id: "Peran",
    accessorKey: "role",
    header: "Peran",
    cell: ({ row }) => {
      const role = row.original.role as Role;

      return (
        <Badge
          style={{
            backgroundColor: `var(--${role})`,
            color: `var(--${role}-foreground)`,
          }}
        >
          {role.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ table }) => <DataTableViewOptions table={table} />,
    cell: ({ row }) => {
      return <ActionDropdownUser row={row} />;
    },
  },
];
