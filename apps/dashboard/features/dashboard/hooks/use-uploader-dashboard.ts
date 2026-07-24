"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "../queries/dashboard.queries";

export function useUploaderDashboard() {
  const docStatsQuery = useQuery(dashboardQueries.documentStats());
  const documentsQuery = useQuery(dashboardQueries.documents({ per_page: 5 }));

  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const isLoading = docStatsQuery.isLoading || documentsQuery.isLoading;
  const stats = docStatsQuery.data?.data;
  const recentDocs = documentsQuery.data?.data || [];

  const handleOpenDetail = (id: number) => {
    setSelectedDocId(id);
    setViewModalOpen(true);
  };

  return {
    isLoading,
    stats,
    recentDocs,
    refetchRecent: documentsQuery.refetch,
    selectedDocId,
    viewModalOpen,
    setViewModalOpen,
    handleOpenDetail,
  };
}
