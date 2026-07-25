import React from "react";
import Link from "next/link";
import { AlertCircle, XCircle, Info, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusAlertsProps {
  isLoading?: boolean;
  pendingDocuments?: number;
}

export function StatusAlerts({ isLoading, pendingDocuments = 0 }: StatusAlertsProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-card shadow-sm p-5 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-60" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-card shadow-sm flex flex-col">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Status Proses Verifikasi
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Ringkasan status antrean dan waktu pemrosesan
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3 flex-1">
        {/* Warning Alert */}
        <Link href="/verification" aria-label="Lihat dokumen pending lebih dari 3 hari">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors group">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="space-y-0.5 flex-1">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                Dokumen Pending &gt; 3 Hari
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Terdapat {pendingDocuments} dokumen menunggu verifikasi lebih dari 3 hari.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </Link>

        {/* Critical Alert */}
        <Link href="/verification" aria-label="Lihat dokumen pending lebih dari 7 hari">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-center gap-3 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors group">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="space-y-0.5 flex-1">
              <p className="text-xs font-semibold text-rose-900 dark:text-rose-300">
                Dokumen Pending &gt; 7 Hari
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-400">
                Terdapat {pendingDocuments} dokumen menunggu verifikasi lebih dari 7 hari.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </Link>

        {/* Info Alert */}
        <Link href="/report" aria-label="Lihat laporan performa sistem">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-center gap-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="space-y-0.5 flex-1">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                Performa Sistem
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Rata-rata waktu verifikasi dokumen saat ini terhubung langsung dengan sistem.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
