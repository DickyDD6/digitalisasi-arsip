"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableViewOptions } from "@/components/ui/data-table";
import { ActionDropdownArchive } from "../_components/ui/action-dropdown-archive";
import {
  ARCHIVE_DOCUMENT_STATUS,
  ARCHIVE_DOCUMENT_TYPE,
} from "@/constants/archive-document";

export const columns: ColumnDef<ArchiveDocument>[] = [
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
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="rounded-sm"
        />
      );
    },
  },
  {
    id: "NNo.",
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
    accessorKey: "npm",
    header: "NPM",
    enableColumnFilter: false,
    enableHiding: false,
  },
  {
    accessorKey: "file_name",
    header: "Nama File",
    enableColumnFilter: false,
    enableHiding: false,
  },
  {
    accessorKey: "document_type",
    header: "Jenis Dokumen",
    cell: ({ row }) => {
      return (
        <Badge variant="muted">
          {ARCHIVE_DOCUMENT_TYPE[
            row.original.document_type as ArchiveDocumentTypeKey
          ] || row.original.document_type}
        </Badge>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "mata_kuliah",
    header: "Mata Kuliah",
  },
  {
    accessorKey: "tahun_ajaran",
    header: "Tahun Ajaran",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "success" | "warning" | "error" = "warning";

      switch (status as ArchiveDocumentStatusKey) {
        case "VERIFIED":
          variant = "success";
          break;
        case "REJECTED":
          variant = "error";
          break;
        case "PENDING":
          variant = "warning";
          break;
      }

      return (
        <Badge variant={variant}>
          {ARCHIVE_DOCUMENT_STATUS[status as ArchiveDocumentStatusKey] ||
            status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ table }) => <DataTableViewOptions table={table} />,
    cell: ({ row }) => {
      return <ActionDropdownArchive row={row} />;
    },
  },
];
