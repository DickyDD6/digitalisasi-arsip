import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  Users,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

interface SecondaryMetricsProps {
  isLoading?: boolean;
  metrics?: {
    todayActivity: number;
    avgVerifyTime: string;
    activeStaffRatio: string;
    urgentCount: number;
  };
}

export function SecondaryMetrics({
  isLoading,
  metrics,
}: SecondaryMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border/60 bg-card shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const todayActivity = metrics?.todayActivity ?? 0;
  const avgVerifyTime = metrics?.avgVerifyTime ?? "0 Hari";
  const activeStaffRatio = metrics?.activeStaffRatio ?? "0/0";
  const urgentCount = metrics?.urgentCount ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Aktivitas Hari Ini */}
      <Link href="/log-activity" aria-label="Lihat log aktivitas">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Aktivitas Hari Ini
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {todayActivity}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Dokumen selesai diverifikasi
            </p>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Waktu Verifikasi Rata-rata */}
      <Link href="/report" aria-label="Lihat laporan verifikasi">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Waktu Verifikasi Rata-rata
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {avgVerifyTime}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">
              Estimasi waktu pemrosesan
            </p>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Staff Aktif */}
      <Link href="/manage-user" aria-label="Kelola pengguna staff">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Staff Aktif
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {activeStaffRatio}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-950 dark:text-orange-400 shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Status keaktifan tim
            </p>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Dokumen Mendesak */}
      <Link href="/verification" aria-label="Lihat dokumen mendesak">
        <Card className="border border-border/60 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Dokumen Mendesak
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground text-rose-600">
                  {urgentCount}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-950 dark:text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-rose-600 mt-2 font-medium">
              Membutuhkan perhatian segera
            </p>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Klik untuk lihat detail <ChevronRight className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
