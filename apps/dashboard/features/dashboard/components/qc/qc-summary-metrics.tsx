"use client";

import React from "react";
import { Clock, CheckCircle2, FileCheck, XCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DocumentStatisticsResponse } from "../../types/dashboard.types";

interface QCSummaryMetricsProps {
  stats: DocumentStatisticsResponse["data"] | undefined;
  fallbackPendingCount: number;
  isLoading: boolean;
}

export function QCSummaryMetrics({
  stats,
  fallbackPendingCount,
  isLoading,
}: QCSummaryMetricsProps) {
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

  const pendingCount = stats?.pending_documents ?? fallbackPendingCount;
  const verifiedCount = stats?.verified_documents ?? 0;
  const rejectedCount = stats?.rejected_documents ?? 0;
  const totalCount = stats?.total_documents ?? (pendingCount + verifiedCount + rejectedCount);

  // Success & rejection rate calculations strictly based on API numbers
  const successRate = totalCount > 0 ? ((verifiedCount / totalCount) * 100).toFixed(1) : "0";
  const rejectionRate = totalCount > 0 ? ((rejectedCount / totalCount) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Perlu Verifikasi */}
      <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-normal text-muted-foreground">Perlu Verifikasi</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {pendingCount}
              </p>
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Dokumen Antrean QC</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FEF9C2] text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Terverifikasi */}
      <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-normal text-muted-foreground">Dokumen Terverifikasi</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {verifiedCount}
              </p>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Terverifikasi QC</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#DCFCE7] text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Diverifikasi */}
      <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-normal text-muted-foreground">Tingkat Kelayakan</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {verifiedCount}
              </p>
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{successRate}% disetujui</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#DBEAFE] text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Ditolak */}
      <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-normal text-muted-foreground">Dokumen Ditolak</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {rejectedCount}
              </p>
              <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>{rejectionRate}% ditolak</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFE2E2] text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
