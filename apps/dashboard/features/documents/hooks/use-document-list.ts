"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { documentListQueries } from "../queries/document-list.queries";

export function useDocumentList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const statsQuery = useQuery(documentListQueries.stats());

  const params = {
    page,
    per_page: 10,
    search: searchQuery,
    ...(selectedStatus && selectedStatus !== "all"
      ? { status: selectedStatus }
      : {}),
  };

  const listQuery = useQuery(documentListQueries.list(params));

  return {
    searchQuery,
    setSearchQuery: (value: string) => {
      setSearchQuery(value);
      setPage(1);
    },
    selectedStatus,
    setSelectedStatus: (value: string) => {
      setSelectedStatus(value);
      setPage(1);
    },
    page,
    setPage,
    stats: statsQuery.data?.data,
    isStatsLoading: statsQuery.isLoading,
    documents: listQuery.data?.data || [],
    meta: listQuery.data?.meta,
    isLoading: listQuery.isLoading,
  };
}
