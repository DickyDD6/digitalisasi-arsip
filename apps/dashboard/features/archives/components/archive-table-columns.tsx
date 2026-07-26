"use client";

import { Badge } from "@repo/ui/badge";
import { Checkbox } from "@repo/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableViewOptions } from "@repo/ui/data-table";
import { ActionDropdownArchive } from "../components/ui/action-dropdown-archive";
import {
  ARCHIVE_DOCUMENT_STATUS,
  ARCHIVE_DOCUMENT_TYPE,
} from "@/features/archives/constants/archive-document";

export const archiveTableColumns: ColumnDef<ArchiveDocument>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
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
    cell: ({ row }) => (
      <Badge variant="secondary">
        {ARCHIVE_DOCUMENT_TYPE[
          row.original.document_type as ArchiveDocumentTypeKey
        ] || row.original.document_type}
      </Badge>
    ),
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
      const statusLower = String(status).toLowerCase();

      const badgeVariant: "default" | "outline" | "destructive" =
        statusLower.includes("terverifikasi") && !statusLower.includes("tidak")
          ? "default"
          : statusLower.includes("tidak") || statusLower.includes("reject")
            ? "destructive"
            : "outline";

      return (
        <Badge variant={badgeVariant}>
          {ARCHIVE_DOCUMENT_STATUS[status as ArchiveDocumentStatusKey] ||
            status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ table }) => <DataTableViewOptions table={table} />,
    cell: ({ row }) => <ActionDropdownArchive row={row} />,
  },
];
