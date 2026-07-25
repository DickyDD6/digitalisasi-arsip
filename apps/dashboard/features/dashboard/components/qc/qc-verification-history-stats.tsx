"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface QCVerificationHistoryStatsProps {
  stats: {
    total: number;
    verified: number;
    rejected: number;
  };
  isLoading: boolean;
}

export function QCVerificationHistoryStats({
  stats,
  isLoading,
}: QCVerificationHistoryStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card 1: Total Diproses */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Total Diproses</span>
          <div className="text-3xl font-extrabold text-foreground">
            {isLoading ? <Skeleton className="h-9 w-12" /> : stats.total}
          </div>
        </div>
      </Card>

      {/* Card 2: Disetujui */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Disetujui</span>
          <div className="text-3xl font-extrabold text-[#00C951]">
            {isLoading ? <Skeleton className="h-9 w-12" /> : stats.verified}
          </div>
        </div>
      </Card>

      {/* Card 3: Ditolak */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Ditolak</span>
          <div className="text-3xl font-extrabold text-[#E7000B]">
            {isLoading ? <Skeleton className="h-9 w-12" /> : stats.rejected}
          </div>
        </div>
      </Card>
    </div>
  );
}
