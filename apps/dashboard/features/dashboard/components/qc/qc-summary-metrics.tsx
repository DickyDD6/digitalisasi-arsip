import React from "react";
import { Clock, FileCheck, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DocumentStatisticsResponse } from "../../types/dashboard.types";

interface QCSummaryMetricsProps {
  stats: DocumentStatisticsResponse["data"] | undefined;
  fallbackPendingCount: number;
  isLoading: boolean;
}

export function QCSummaryMetrics({ stats, fallbackPendingCount, isLoading }: QCSummaryMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border/60 bg-card shadow-sm p-5 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border border-border/60 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Perlu Verifikasi</p>
              <p className="text-2xl font-bold tracking-tight text-amber-600 mt-1">
                {stats?.pending_documents ?? fallbackPendingCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Terverifikasi</p>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 mt-1">
                {stats?.verified_documents ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Ditolak</p>
              <p className="text-2xl font-bold tracking-tight text-rose-600 mt-1">
                {stats?.rejected_documents ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Dokumen</p>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                {stats?.total_documents ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
