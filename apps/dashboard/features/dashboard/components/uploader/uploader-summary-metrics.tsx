import React from "react";
import Link from "next/link";
import { Upload, Clock, TrendingUp, TrendingDown, FileX, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DocumentStats } from "../../types/dashboard.types";

interface UploaderSummaryMetricsProps {
  isLoading?: boolean;
  stats?: DocumentStats;
}

export function UploaderSummaryMetrics({ isLoading, stats }: UploaderSummaryMetricsProps) {
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
      {/* Card 1: Total Upload */}
      <Link href="/upload-history" aria-label="Lihat semua riwayat upload">
        <Card className="border border-border/60 bg-card shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] text-[#155DFC] dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-normal">Total Upload</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stats?.total_documents ?? 0}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>+12 hari ini</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            Klik untuk lihat riwayat <ChevronRight className="w-3 h-3" />
          </p>
        </Card>
      </Link>

      {/* Card 2: Menunggu Verifikasi */}
      <Link href="/upload-history" aria-label="Lihat dokumen menunggu verifikasi">
        <Card className="border border-border/60 bg-card shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF9C2] text-[#D08700] dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-normal">Menunggu Verifikasi</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stats?.pending_documents ?? 0}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium pt-0.5">
                <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                <span>Perlu Perhatian</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            Klik untuk lihat riwayat <ChevronRight className="w-3 h-3" />
          </p>
        </Card>
      </Link>

      {/* Card 3: Terverifikasi */}
      <Link href="/upload-history" aria-label="Lihat dokumen terverifikasi">
        <Card className="border border-border/60 bg-card shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#00A63E] dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-normal">Terverifikasi</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stats?.verified_documents ?? 0}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium pt-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>80.8% Success Rate</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            Klik untuk lihat riwayat <ChevronRight className="w-3 h-3" />
          </p>
        </Card>
      </Link>

      {/* Card 4: Ditolak / Invalid */}
      <Link href="/upload-history" aria-label="Lihat dokumen ditolak atau invalid">
        <Card className="border border-border/60 bg-card shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFE2E2] text-[#E7000B] dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileX className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-normal">Ditolak / Invalid</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stats?.rejected_documents ?? 0}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium pt-0.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Perlu Diperbaiki</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            Klik untuk lihat riwayat <ChevronRight className="w-3 h-3" />
          </p>
        </Card>
      </Link>
    </div>
  );
}
