import { queryOptions } from "@tanstack/react-query";
import { documentListService, DocumentListParams } from "../services/document-list.service";
import { dashboardQueries } from "@/features/dashboard/queries/dashboard.queries";

export const documentListQueries = {
  all: ["uploader-documents"] as const,

  list: (params: DocumentListParams) =>
    queryOptions({
      queryKey: [...documentListQueries.all, "list", params],
      queryFn: () => documentListService.getDocuments(params),
      staleTime: 1000 * 60 * 2,
    }),

  stats: () => dashboardQueries.documentStats(),
};
