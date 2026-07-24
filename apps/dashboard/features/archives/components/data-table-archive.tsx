"use client";

import { Button } from "@/components/ui/button";
import {
  DataTableColumnHeader,
  DataTablePagination,
} from "@/components/ui/data-table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { CloudAlert, FileX, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContextMenuArchive } from "./ui/context-menu-archive";
import { DeleteArchiveModal } from "./ui/delete-archive-modal";
import { DownloadArchiveModal } from "./ui/download-archive-modal";
import { FilterDropdownArchive } from "./ui/filter-dropdown-archive";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalItems: number;
  isError?: boolean;
  isPending?: boolean;
  isFetching?: boolean;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  globalFilter?: string;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
  filterOptions?: Record<string, { value: string; label: string }[]>;
}

export function DataTableArchive<TData extends ArchiveDocument, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  totalItems,
  isError,
  isPending,
  isFetching,
  columnFilters,
  setColumnFilters,
  filterOptions,
  globalFilter,
  setGlobalFilter,
}: DataTableProps<TData, TValue>) {
  const [localPagination, setLocalPagination] = useState<PaginationState>(pagination);

  useEffect(() => {
    if (!isFetching && !isPending) {
      setLocalPagination(pagination);
    }
  }, [pagination, isFetching, isPending]);

  const pageCount = Math.ceil(totalItems / localPagination.pageSize);

  eslint - disable - next - line react - hooks / incompatible - library
  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      cell: ({ getValue }) => {
        const value = getValue();
        return typeof value === "string" ? value : "-";
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    state: { pagination, columnFilters, globalFilter },
    pageCount,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
    globalFilterFn: "auto",
  });

  return (
    <>
      {table.getSelectedRowModel().rows.length > 1 && (
        <div className="flex items-center justify-between gap-2 py-2 px-4">
          <span className="text-sm">
            {table.getSelectedRowModel().rows.length} dari {table.getRowCount()}{" "}
            baris dipilih
          </span>
          <div className="flex gap-4">
            <DownloadArchiveModal
              id={table.getSelectedRowModel().rows.map((row) => row.original.id)}
            />
            <DeleteArchiveModal
              id={table.getSelectedRowModel().rows.map((row) => row.original.id)}
            />
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.column.getCanSort() ? (
                    <div className="flex gap-1 items-center">
                      <DataTableColumnHeader
                        column={header.column}
                        title={header.column.columnDef.header as string}
                      />
                      {header.column.getCanFilter() && filterOptions?.[header.column.id] ? (
                        <FilterDropdownArchive
                          header={header}
                          setColumnFilters={setColumnFilters}
                          filterOptions={filterOptions}
                        />
                      ) : null}
                    </div>
                  ) : header.isPlaceholder ? null : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isPending ? (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Sedang memuat data...
                </div>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia><CloudAlert /></EmptyMedia>
                    <EmptyTitle>Gagal memuat data</EmptyTitle>
                    <EmptyDescription>Terjadi kesalahan saat mengambil data arsip.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent><Button>Muat Ulang Data</Button></EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <ContextMenuArchive key={row.id} row={row} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia><FileX /></EmptyMedia>
                    <EmptyTitle>Tidak ada data</EmptyTitle>
                    <EmptyDescription>
                      Tidak ditemukan arsip yang sesuai dengan kriteria pencarian atau filter yang diterapkan.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent><Button variant="outline">Hapus Filter</Button></EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination {...{ table, isFetching, isPending }} />
    </>
  );
}
