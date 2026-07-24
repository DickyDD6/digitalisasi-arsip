import React from "react";
import { AlertCircle, XCircle, Info } from "lucide-react";
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
}

export function StatusAlerts({ isLoading }: StatusAlertsProps) {
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
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
              Dokumen Pending &gt; 3 Hari
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Terdapat 0 dokumen menunggu verifikasi lebih dari 3 hari.
            </p>
          </div>
        </div>

        {/* Critical Alert */}
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-rose-900 dark:text-rose-300">
              Dokumen Pending &gt; 7 Hari
            </p>
            <p className="text-xs text-rose-700 dark:text-rose-400">
              Terdapat 0 dokumen menunggu verifikasi lebih dari 7 hari.
            </p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
              Performa Sistem
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Rata-rata waktu verifikasi dokumen saat ini terhubung langsung dengan sistem.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
