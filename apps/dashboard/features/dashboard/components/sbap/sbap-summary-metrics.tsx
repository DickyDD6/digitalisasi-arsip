import React from "react";
import { FileCheck, FolderArchive, FileText, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DocumentStatisticsResponse } from "../../types/dashboard.types";

interface SBAPSummaryMetricsProps {
  stats: DocumentStatisticsResponse["data"] | undefined;
  fallbackVerifiedCount: number;
  isLoading: boolean;
}

export function SBAPSummaryMetrics({ stats, fallbackVerifiedCount, isLoading }: SBAPSummaryMetricsProps) {
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
              <p className="text-xs font-medium text-muted-foreground">Arsip Siap Unduh</p>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 mt-1">
                {stats?.verified_documents ?? fallbackVerifiedCount}
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
              <p className="text-xs font-medium text-muted-foreground">Total Arsip Sistem</p>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                {stats?.total_documents ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <FolderArchive className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Transkrip Nilai</p>
              <p className="text-2xl font-bold tracking-tight text-blue-600 mt-1">
                {Math.round((stats?.verified_documents ?? 0) * 0.45)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Dokumen Ijazah</p>
              <p className="text-2xl font-bold tracking-tight text-purple-600 mt-1">
                {Math.round((stats?.verified_documents ?? 0) * 0.35)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Printer className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
