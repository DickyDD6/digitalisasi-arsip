"use client";

import { Card, CardContent, CardTitle } from "@repo/ui/card";
import { GenerateReportDialog } from "@/features/reports/components/generate-report-dialog";
import { reportQueries } from "@/features/reports/queries/report.queries";
import { useQuery } from "@tanstack/react-query";
import { FileCheck, FileClock, FileText, FileX } from "lucide-react";

export const ReportContent = () => {
  const { data: statsResponse } = useQuery(reportQueries.dashboardStats());
  const stats = statsResponse?.data;

  return (
    <div className="space-y-6">
      {/* Real Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Dokumen</p>
              <h3 className="text-2xl font-bold">
                {stats?.total_documents ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="size-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Terverifikasi</p>
              <h3 className="text-2xl font-bold text-green-600">
                {stats?.verified_documents ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-950 rounded-full">
              <FileCheck className="size-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Pending Verifikasi
              </p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {stats?.pending_documents ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-950 rounded-full">
              <FileClock className="size-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Ditolak</p>
              <h3 className="text-2xl font-bold text-red-600">
                {stats?.rejected_documents ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-950 rounded-full">
              <FileX className="size-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types & Generation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <CardTitle className="text-lg">Laporan Statistik</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Statistik penggunaan sistem, jumlah dokumen, dan aktivitas
              pengguna.
            </p>
            <GenerateReportDialog
              reportTitle="Laporan Statistik"
              defaultContent={["upload_stats", "trend_analysis"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CardTitle className="text-lg">Laporan Pengguna</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Daftar pengguna aktif, peran, dan aktivitas terakhir.
            </p>
            <GenerateReportDialog
              reportTitle="Laporan Pengguna"
              defaultContent={["user_activity"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CardTitle className="text-lg">Laporan Dokumen</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Daftar dokumen yang telah diunggah, status, dan informasi terkait.
            </p>
            <GenerateReportDialog
              reportTitle="Laporan Dokumen"
              defaultContent={["doc_status", "upload_stats"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CardTitle className="text-lg">Laporan Audit</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Daftar aktivitas audit sistem, termasuk akses dokumen dan
              perubahan data.
            </p>
            <GenerateReportDialog
              reportTitle="Laporan Audit"
              defaultContent={["qc_metrics", "user_activity"]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
