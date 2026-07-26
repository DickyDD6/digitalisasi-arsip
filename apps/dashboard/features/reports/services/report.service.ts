import { http } from "@/shared/lib/http";
import { downloadFile } from "@/shared/utils/download-helper";

export interface GenerateReportPayload {
  period_start: string;
  period_end: string;
  format: "pdf" | "xlsx" | "csv";
  type: "monthly" | "annual" | "custom";
  style?: "detailed" | "summary" | "executive";
  content?: string[];
}

export interface DashboardReportStats {
  total_documents: number;
  verified_documents: number;
  pending_documents: number;
  rejected_documents: number;
}

export const reportService = {
  async getDashboardStats(params?: { start_date?: string; end_date?: string }) {
    const res = await http.get<{
      message: string;
      data: DashboardReportStats;
      period: { start_date: string; end_date: string };
    }>("/api/reports/dashboard", { params });
    return res.data;
  },

  async generate(payload: GenerateReportPayload, filename = "laporan.pdf") {
    const res = await http.post("/api/reports/generate", payload, {
      responseType: "blob",
    });
    const blob = new Blob([res.data], {
      type:
        payload.format === "pdf"
          ? "application/pdf"
          : payload.format === "xlsx"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "text/csv",
    });
    downloadFile(blob, filename);
    return true;
  },
};
