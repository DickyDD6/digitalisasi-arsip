"use client";

import React from "react";
import { Card } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

interface QCVerifiedDocumentStatsProps {
  stats: {
    total: number;
    transcriptCount: number;
    otherCount: number;
  };
  isLoading: boolean;
}

export function QCVerifiedDocumentStats({
  stats,
  isLoading,
}: QCVerifiedDocumentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card 1: Total Terverifikasi */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Total Terverifikasi</span>
          <div className="text-3xl font-extrabold text-[#00C951]">
            {isLoading ? <Skeleton className="h-9 w-12" /> : stats.total}
          </div>
        </div>
      </Card>

      {/* Card 2: Transkrip Nilai */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Transkrip Nilai</span>
          <div className="text-3xl font-extrabold text-[#1E40AF]">
            {isLoading ? <Skeleton className="h-9 w-12" /> : stats.transcriptCount}
          </div>
        </div>
      </Card>

      {/* Card 3: Nilai & Ijazah */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Nilai & Ijazah</span>
          <div className="text-3xl font-extrabold text-[#D08700]">
            {isLoading ? <Skeleton className="h-9 w-12" /> : stats.otherCount}
          </div>
        </div>
      </Card>
    </div>
  );
}
