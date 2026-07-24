import { queryOptions } from "@tanstack/react-query";
import { uploadHistoryService, FetchUploadHistoryParams } from "../services/upload-history.service";
import { dashboardService } from "@/features/dashboard/services/dashboard.service";

export const uploadHistoryQueries = {
  all: ["upload-history"] as const,
  list: (params: FetchUploadHistoryParams = {}) =>
    queryOptions({
      queryKey: [...uploadHistoryQueries.all, "list", params],
      queryFn: () => uploadHistoryService.getUploadHistory(params),
      staleTime: 1000 * 60 * 2,
    }),
  stats: () =>
    queryOptions({
      queryKey: [...uploadHistoryQueries.all, "stats"],
      queryFn: () => dashboardService.getDocumentStatistics(),
      staleTime: 1000 * 60 * 5,
    }),
};
