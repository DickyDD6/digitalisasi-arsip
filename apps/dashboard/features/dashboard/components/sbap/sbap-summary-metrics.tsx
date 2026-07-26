import React from "react";
import Link from "next/link";
import { FileCheck, Download, Search, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import type { DocumentStatisticsResponse } from "../../types/dashboard.types";

interface SBAPSummaryMetricsProps {
  stats: DocumentStatisticsResponse["data"] | undefined;
  fallbackVerifiedCount: number;
  isLoading: boolean;
}

export function SBAPSummaryMetrics({
  stats,
  fallbackVerifiedCount,
  isLoading,
}: SBAPSummaryMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="border border-border/60 bg-card shadow-sm p-5 space-y-3"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  const verifiedCount = stats?.verified_documents ?? fallbackVerifiedCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Arsip Tersedia */}
      <Link
        href="/available-archives"
        className="group block focus:outline-none"
      >
        <Card className="border border-border/60 bg-card shadow-sm group-hover:border-blue-500/40 transition-all duration-200 group-hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Arsip Tersedia
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {verifiedCount}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-2">
                  <ArrowUpRight className="w-3 h-3" />
                  Terverifikasi
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* 2. Total Dokumen */}
      <Link href="/download-history" className="group block focus:outline-none">
        <Card className="border border-border/60 bg-card shadow-sm group-hover:border-emerald-500/40 transition-all duration-200 group-hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Dokumen
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stats?.total_documents ?? verifiedCount}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                  <ArrowUpRight className="w-3 h-3" />
                  Aktif
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* 3. Dokumen Menunggu Verifikasi */}
      <Link href="/search-archive" className="group block focus:outline-none">
        <Card className="border border-border/60 bg-card shadow-sm group-hover:border-purple-500/40 transition-all duration-200 group-hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Menunggu Verifikasi
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stats?.pending_documents ?? 0}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-2">
                  <ArrowUpRight className="w-3 h-3" />
                  Dalam Proses
                </span>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* 4. Dokumen Ditolak */}
      <div className="group block">
        <Card className="border border-border/60 bg-card shadow-sm transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Dokumen Ditolak
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {stats?.rejected_documents ?? 0}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-2">
                  <ArrowUpRight className="w-3 h-3" />
                  Perlu Perbaikan
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
