"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { archiveQueries } from "../queries/archive.queries";

export function useArchiveTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const listQuery = useQuery(
    archiveQueries.list({
      page: pagination.pageIndex + 1,
      per_page: pagination.pageSize,
      search: globalFilter,
      ...Object.fromEntries(columnFilters.map((f) => [f.id, f.value])),
    }),
  );

  const filterOptionsQuery = useQuery(
    archiveQueries.filterOptions(listQuery.data?.meta?.total ?? 1000),
  );

  return {
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    data: listQuery.data,
    isPending: listQuery.isPending,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    filterOptionsData: filterOptionsQuery.data,
  };
}
