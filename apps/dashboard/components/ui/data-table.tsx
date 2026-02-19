import React from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Loader2,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

import {
  Column,
  PaginationState,
  Table as ReactTable,
} from "@tanstack/react-table";

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            Menaik
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            Menurun
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <Settings2 />
            Default
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DataTablePagination<TData>({
  table,
  isFetching,
  isPending,
}: {
  table: ReactTable<TData>;
  isFetching?: boolean;
  isPending?: boolean;
}) {
  const [loadingButton, setLoadingButton] = React.useState<string | null>(null);
  const currentPagination = table.getState().pagination;
  const [pendingPagination, setPendingPagination] =
    React.useState<PaginationState>(currentPagination);

  const handlePageChange = (buttonId: string, callback: () => void) => {
    if (isFetching || isPending) return;

    setPendingPagination(currentPagination);
    setLoadingButton(buttonId);
    callback();
  };

  React.useEffect(() => {
    if (!isFetching && !isPending) {
      setPendingPagination(currentPagination);
      setLoadingButton(null);
    }
  }, [isFetching, isPending, pendingPagination, currentPagination]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} dari{" "}
        {table.getFilteredRowModel().rows.length} baris yang dipilih.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Baris per halaman</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              if (!isFetching && !isPending) {
                table.setPageSize(Number(value));
              }
            }}
            disabled={isFetching || isPending}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-max items-center justify-center text-sm font-medium">
          Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() =>
              handlePageChange("first", () => table.setPageIndex(0))
            }
            disabled={!table.getCanPreviousPage() || isFetching || isPending}
          >
            <span className="sr-only">Pergi ke halaman pertama</span>
            {loadingButton === "first" && (isFetching || isPending) ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ChevronsLeft />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange("prev", () => table.previousPage())}
            disabled={!table.getCanPreviousPage() || isFetching || isPending}
          >
            <span className="sr-only">Buka halaman sebelumnya</span>
            {loadingButton === "prev" && (isFetching || isPending) ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ChevronLeft />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange("next", () => table.nextPage())}
            disabled={!table.getCanNextPage() || isFetching || isPending}
          >
            <span className="sr-only">Buka halaman berikutnya</span>
            {loadingButton === "next" && (isFetching || isPending) ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ChevronRight />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() =>
              handlePageChange("last", () =>
                table.setPageIndex(table.getPageCount() - 1),
              )
            }
            disabled={!table.getCanNextPage() || isFetching || isPending}
          >
            <span className="sr-only">Pergi ke halaman terakhir</span>
            {loadingButton === "last" && (isFetching || isPending) ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ChevronsRight />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DataTableViewOptions<TData>({ table }: { table: ReactTable<TData> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-37.5">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataTableColumnHeader, DataTablePagination, DataTableViewOptions };
