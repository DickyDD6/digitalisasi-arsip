import React from "react";
import { CheckCircle2, Clock, Upload, XCircle } from "lucide-react";
import { Card } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

interface UploadHistorySummaryMetricsProps {
  isLoading: boolean;
  stats?: {
    total_documents: number;
    verified_documents: number;
    pending_documents: number;
    rejected_documents: number;
  };
}

export function UploadHistorySummaryMetrics({
  isLoading,
  stats,
}: UploadHistorySummaryMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border/60 bg-card shadow-sm p-5 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Upload */}
      <Card className="border border-border/60 bg-card shadow-sm p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#155DFC] flex items-center justify-center shrink-0">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-normal">Total Upload</p>
          <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
            {stats?.total_documents ?? 0}
          </p>
        </div>
      </Card>

      {/* Terverifikasi */}
      <Card className="border border-border/60 bg-card shadow-sm p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#00A63E] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-normal">Terverifikasi</p>
          <p className="text-2xl font-bold tracking-tight text-[#00A63E] mt-0.5">
            {stats?.verified_documents ?? 0}
          </p>
        </div>
      </Card>

      {/* Menunggu */}
      <Card className="border border-border/60 bg-card shadow-sm p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#FEF9C2] text-[#D08700] flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-normal">Menunggu</p>
          <p className="text-2xl font-bold tracking-tight text-[#D08700] mt-0.5">
            {stats?.pending_documents ?? 0}
          </p>
        </div>
      </Card>

      {/* Ditolak */}
      <Card className="border border-border/60 bg-card shadow-sm p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#FFE2E2] text-[#E7000B] flex items-center justify-center shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-normal">Ditolak</p>
          <p className="text-2xl font-bold tracking-tight text-[#E7000B] mt-0.5">
            {stats?.rejected_documents ?? 0}
          </p>
        </div>
      </Card>
    </div>
  );
}
