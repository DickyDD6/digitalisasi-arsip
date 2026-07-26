"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "../queries/dashboard.queries";
import type { DocumentItem } from "../types/dashboard.types";
import { getDocCategory, getNormalizedStatus } from "../utils/document-mappers";
import type { QCFilterCategoryOption } from "../components/qc/qc-verified-document-filter";

interface UseQCVerifiedDocumentsOptions {
  search?: string;
  categoryFilter?: QCFilterCategoryOption;
}

export function useQCVerifiedDocuments({
  search = "",
  categoryFilter = "all",
}: UseQCVerifiedDocumentsOptions = {}) {
  // Query all documents from API
  const query = useQuery(
    dashboardQueries.documents({
      search: search || undefined,
      per_page: 100,
      page: 1,
    }),
  );

  const rawDocs: DocumentItem[] = query.data?.data || [];

  // Filter verified documents using getNormalizedStatus(doc) to capture all API status variants
  const allVerifiedDocs = rawDocs.filter(
    (doc) => getNormalizedStatus(doc) === "verified",
  );

  // Apply category filter using normalized getDocCategory helper
  const filteredDocs = allVerifiedDocs.filter((doc) => {
    if (categoryFilter === "all") return true;
    const cat = getDocCategory(doc);
    return cat.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  // Calculate breakdown counts
  const transcriptCount = allVerifiedDocs.filter((d) => {
    const cat = getDocCategory(d);
    return cat.toLowerCase().includes("transkrip");
  }).length;

  const otherCount = allVerifiedDocs.length - transcriptCount;

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    verifiedDocs: filteredDocs,
    refetchVerified: query.refetch,
    stats: {
      total: allVerifiedDocs.length,
      transcriptCount,
      otherCount,
    },
  };
}
