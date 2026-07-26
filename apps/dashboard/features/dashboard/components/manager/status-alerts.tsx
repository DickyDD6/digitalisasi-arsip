import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  XCircle,
  Info,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

interface StatusAlertsProps {
  isLoading?: boolean;
  pendingDocuments?: number;
}

export function StatusAlerts({
  isLoading,
  pendingDocuments = 0,
}: StatusAlertsProps) {
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

  const hasPending = pendingDocuments > 0;

  return (
    <Card className="border border-border/60 bg-card shadow-sm flex flex-col">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Status Proses Verifikasi
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Notifikasi status antrean dan pemrosesan dokumen
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-0 gap-4 justify-between flex-col flex flex-1">
        {/* Warning Alert (> 3 Hari) */}
        <div className="flex flex-col flex-1 gap-4">
          {hasPending ? (
            <Link
              href="/verification"
              aria-label="Lihat dokumen pending lebih dari 3 hari"
            >
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3.5 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all group shadow-2xs">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="space-y-0.5 flex-1">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                    Dokumen Pending &gt; 3 Hari
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Terdapat {pendingDocuments} dokumen menunggu verifikasi
                    lebih dari 3 hari.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </Link>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3.5 opacity-80 cursor-default">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="space-y-0.5 flex-1">
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  Antrean &gt; 3 Hari Bersih
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Tidak ada antrean dokumen pending lebih dari 3 hari saat ini.
                </p>
              </div>
            </div>
          )}
          {/* Critical Alert (> 7 Hari) */}
          {hasPending ? (
            <Link
              href="/verification"
              aria-label="Lihat dokumen pending lebih dari 7 hari"
            >
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-center gap-3.5 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all group shadow-2xs">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <div className="space-y-0.5 flex-1">
                  <p className="text-xs font-semibold text-rose-900 dark:text-rose-300">
                    Dokumen Pending &gt; 7 Hari
                  </p>
                  <p className="text-xs text-rose-700 dark:text-rose-400">
                    Terdapat {pendingDocuments} dokumen menunggu verifikasi
                    lebih dari 7 hari.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </Link>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3.5 opacity-80 cursor-default">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="space-y-0.5 flex-1">
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  Antrean &gt; 7 Hari Bersih
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Semua dokumen telah diproses dalam batas waktu standar.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info Alert (Informasi Sistem) */}
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 flex items-center gap-3.5 cursor-default">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div className="space-y-0.5 flex-1">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
              Informasi Pemrosesan Dokumen
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Notifikasi ini mengindikasikan status antrean riil dari database.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
