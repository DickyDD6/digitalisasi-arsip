"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "../queries/dashboard.queries";
import type { DocumentItem } from "../types/dashboard.types";
import { getNormalizedStatus } from "../utils/document-mappers";

interface UseQCVerificationHistoryOptions {
  search?: string;
  statusFilter?: "all" | "verified" | "rejected";
}

export function useQCVerificationHistory({
  search = "",
  statusFilter = "all",
}: UseQCVerificationHistoryOptions = {}) {
  // Query all documents from API
  const historyQuery = useQuery(
    dashboardQueries.documents({
      search: search || undefined,
      per_page: 50,
      page: 1,
    })
  );

  const rawDocs: DocumentItem[] = historyQuery.data?.data || [];

  // Strictly filter items that have been processed (verified or rejected).
  // Pending/menunggu_verifikasi documents are EXCLUDED from verification history.
  const processedDocs = rawDocs.filter((doc) => {
    const norm = getNormalizedStatus(doc);
    return norm === "verified" || norm === "rejected";
  });

  // Apply status tab filter if active
  const filteredDocs = processedDocs.filter((doc) => {
    const norm = getNormalizedStatus(doc);
    if (statusFilter === "verified") return norm === "verified";
    if (statusFilter === "rejected") return norm === "rejected";
    return true;
  });

  // Compute stats accurately from processed documents
  const verifiedCount = processedDocs.filter((d) => getNormalizedStatus(d) === "verified").length;
  const rejectedCount = processedDocs.filter((d) => getNormalizedStatus(d) === "rejected").length;

  return {
    isLoading: historyQuery.isLoading,
    isError: historyQuery.isError,
    historyDocs: filteredDocs,
    refetchHistory: historyQuery.refetch,
    stats: {
      total: processedDocs.length,
      verified: verifiedCount,
      rejected: rejectedCount,
    },
  };
}
