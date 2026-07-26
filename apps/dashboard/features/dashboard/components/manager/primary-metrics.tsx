import React from "react";
import Link from "next/link";
import {
  FileText,
  FileCheck,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

interface PrimaryMetricsProps {
  isLoading?: boolean;
  metrics: {
    totalDocuments: number;
    verifiedDocuments: number;
    pendingDocuments: number;
    rejectedDocuments: number;
  };
}

export function PrimaryMetrics({ isLoading, metrics }: PrimaryMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border/60 bg-card shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const verifiedPercentage =
    metrics.totalDocuments > 0
      ? ((metrics.verifiedDocuments / metrics.totalDocuments) * 100).toFixed(1)
      : "0.0";
  const pendingPercentage =
    metrics.totalDocuments > 0
      ? ((metrics.pendingDocuments / metrics.totalDocuments) * 100).toFixed(1)
      : "0.0";
  const rejectedPercentage =
    metrics.totalDocuments > 0
      ? ((metrics.rejectedDocuments / metrics.totalDocuments) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Dokumen Terdigitalisasi */}
      <Link href="/document-list" aria-label="Lihat semua arsip dokumen">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Total Dokumen Terdigitalisasi
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {metrics.totalDocuments.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-950 dark:text-orange-400 shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Total dokumen tersimpan</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Terverifikasi */}
      <Link href="/document-list" aria-label="Lihat arsip terverifikasi">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Terverifikasi
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {metrics.verifiedDocuments.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="text-emerald-600 font-semibold">
                {verifiedPercentage}%
              </span>
              <span>dari total arsip</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Menunggu Verifikasi */}
      <Link href="/verification" aria-label="Lihat antrean verifikasi QC">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Menunggu Verifikasi
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {metrics.pendingDocuments.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="text-amber-600 font-semibold">
                {pendingPercentage}%
              </span>
              <span>perlu tindak lanjut QC</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Ditolak / Perlu Perbaikan */}
      <Link href="/rejected-documents" aria-label="Lihat dokumen ditolak">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Ditolak / Perlu Perbaikan
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {metrics.rejectedDocuments.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-950 dark:text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="text-rose-600 font-semibold">
                {rejectedPercentage}%
              </span>
              <span>perlu re-upload uploader</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
