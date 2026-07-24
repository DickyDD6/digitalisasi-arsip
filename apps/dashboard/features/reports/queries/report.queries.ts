import { queryOptions } from "@tanstack/react-query";
import { reportService } from "../services/report.service";

export const reportQueries = {
  dashboardStats: (params?: { start_date?: string; end_date?: string }) =>
    queryOptions({
      queryKey: ["reports", "dashboard", params],
      queryFn: () => reportService.getDashboardStats(params),
    }),
};
