"use client";

import React from "react";
import Link from "next/link";
import { Clock, CheckCircle2, FileCheck, XCircle, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
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

  const successRate = totalCount > 0 ? ((verifiedCount / totalCount) * 100).toFixed(1) : "0";
  const rejectionRate = totalCount > 0 ? ((rejectedCount / totalCount) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Perlu Verifikasi */}
      <Link href="/verification" aria-label="Lihat antrean dokumen perlu verifikasi">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
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
              <div className="p-3.5 rounded-2xl bg-[#FEF9C2] text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk verifikasi <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* 2. Terverifikasi */}
      <Link href="/verified-documents" aria-label="Lihat dokumen sudah diverifikasi">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
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
              <div className="p-3.5 rounded-2xl bg-[#DCFCE7] text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* 3. Tingkat Kelayakan */}
      <Link href="/verification-history" aria-label="Lihat riwayat verifikasi">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
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
              <div className="p-3.5 rounded-2xl bg-[#DBEAFE] text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk riwayat <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* 4. Ditolak */}
      <Link href="/rejected-documents" aria-label="Lihat dokumen ditolak">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
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
              <div className="p-3.5 rounded-2xl bg-[#FFE2E2] text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 shrink-0 group-hover:scale-105 transition-transform">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
