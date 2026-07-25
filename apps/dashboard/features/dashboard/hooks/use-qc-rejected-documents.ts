"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "../queries/dashboard.queries";
import type { DocumentItem } from "../types/dashboard.types";
import { getDocCategory, getNormalizedStatus } from "../utils/document-mappers";
import type { QCFilterCategoryOption } from "../components/qc/qc-verified-document-filter";

interface UseQCRejectedDocumentsOptions {
  search?: string;
  categoryFilter?: QCFilterCategoryOption;
}

export function useQCRejectedDocuments({
  search = "",
  categoryFilter = "all",
}: UseQCRejectedDocumentsOptions = {}) {
  // Query all documents from API
  const query = useQuery(
    dashboardQueries.documents({
      search: search || undefined,
      per_page: 100,
      page: 1,
    })
  );

  const rawDocs: DocumentItem[] = query.data?.data || [];

  // Filter rejected documents using getNormalizedStatus(doc) to capture all API status variants
  const allRejectedDocs = rawDocs.filter(
    (doc) => getNormalizedStatus(doc) === "rejected"
  );

  // Apply category filter using normalized getDocCategory helper
  const filteredDocs = allRejectedDocs.filter((doc) => {
    if (categoryFilter === "all") return true;
    const cat = getDocCategory(doc);
    return cat.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  // Calculate breakdown counts for rejected statistics
  const revisionNeededCount = allRejectedDocs.filter((d) => {
    const note = (d.verification_note || "").toLowerCase();
    return note.includes("revisi") || note.includes("buram") || note.includes("kurang");
  }).length;

  const permanentRejectedCount = allRejectedDocs.length - revisionNeededCount;

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    rejectedDocs: filteredDocs,
    refetchRejected: query.refetch,
    stats: {
      total: allRejectedDocs.length,
      revisionNeededCount,
      permanentRejectedCount,
    },
  };
}
