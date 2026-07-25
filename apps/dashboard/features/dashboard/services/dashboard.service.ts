import { http } from "@/shared/lib/http";
import type {
  DashboardStatsResponse,
  DocumentStatisticsResponse,
  AuditLogStatisticsResponse,
  UserStatisticsResponse,
  DocumentListResponse,
  VerifyDocumentPayload,
} from "../types/dashboard.types";

export const dashboardService = {
  getReportDashboardStats: async (startDate?: string, endDate?: string) => {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await http.get<DashboardStatsResponse>("/api/reports/dashboard", {
      params,
    });
    return response.data;
  },

  getDocumentStatistics: async () => {
    const response = await http.get<DocumentStatisticsResponse>(
      "/api/documents/statistics"
    );
    return response.data;
  },

  getAuditLogStatistics: async (startDate?: string, endDate?: string) => {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await http.get<AuditLogStatisticsResponse>(
      "/api/audit-logs/statistics",
      { params }
    );
    return response.data;
  },

  getUserStatistics: async () => {
    const response = await http.get<UserStatisticsResponse>(
      "/api/users/statistics"
    );
    return response.data;
  },

  getDocuments: async (params?: Record<string, any>) => {
    const response = await http.get<DocumentListResponse>("/api/documents", {
      params,
    });
    return response.data;
  },

  getPendingDocuments: async (perPage = 15, page = 1) => {
    const response = await http.get<DocumentListResponse>("/api/documents/pending", {
      params: { per_page: perPage, page },
    });
    return response.data;
  },

  verifyDocument: async (documentId: number, payload: VerifyDocumentPayload) => {
    const response = await http.patch(`/api/documents/${documentId}/verify`, payload);
    return response.data;
  },
};
