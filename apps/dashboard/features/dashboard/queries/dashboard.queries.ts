import { queryOptions } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export const dashboardQueries = {
  all: ["dashboard"] as const,
  stats: (startDate?: string, endDate?: string) =>
    queryOptions({
      queryKey: [...dashboardQueries.all, "reports-stats", startDate, endDate],
      queryFn: () => dashboardService.getReportDashboardStats(startDate, endDate),
      staleTime: 1000 * 60 * 5,
    }),
  documentStats: () =>
    queryOptions({
      queryKey: [...dashboardQueries.all, "document-stats"],
      queryFn: () => dashboardService.getDocumentStatistics(),
      staleTime: 1000 * 60 * 5,
    }),
  auditLogStats: (startDate?: string, endDate?: string) =>
    queryOptions({
      queryKey: [...dashboardQueries.all, "audit-log-stats", startDate, endDate],
      queryFn: () => dashboardService.getAuditLogStatistics(startDate, endDate),
      staleTime: 1000 * 60 * 5,
    }),
  userStats: () =>
    queryOptions({
      queryKey: [...dashboardQueries.all, "user-stats"],
      queryFn: () => dashboardService.getUserStatistics(),
      staleTime: 1000 * 60 * 5,
    }),
  documents: (params?: Record<string, any>) =>
    queryOptions({
      queryKey: [...dashboardQueries.all, "documents", params],
      queryFn: () => dashboardService.getDocuments(params),
      staleTime: 1000 * 60 * 2,
    }),
  pendingDocuments: (perPage = 15, page = 1) =>
    queryOptions({
      queryKey: [...dashboardQueries.all, "pending-documents", perPage, page],
      queryFn: () => dashboardService.getPendingDocuments(perPage, page),
      staleTime: 1000 * 60 * 2,
    }),
};
