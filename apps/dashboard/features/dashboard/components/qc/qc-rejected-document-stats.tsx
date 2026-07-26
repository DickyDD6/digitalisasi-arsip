"use client";

import React from "react";
import { Card } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

interface QCRejectedDocumentStatsProps {
  stats: {
    total: number;
    revisionNeededCount: number;
    permanentRejectedCount: number;
  };
  isLoading: boolean;
}

export function QCRejectedDocumentStats({
  stats,
  isLoading,
}: QCRejectedDocumentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card 1: Total Ditolak */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Total Ditolak
          </span>
          <div className="text-3xl font-extrabold text-[#E7000B]">
            {isLoading ? <Skeleton className="h-9 w-12" /> : stats.total}
          </div>
        </div>
      </Card>

      {/* Card 2: Perlu Revisi Uploader */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Perlu Revisi Uploader
          </span>
          <div className="text-3xl font-extrabold text-[#D08700]">
            {isLoading ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              stats.revisionNeededCount
            )}
          </div>
        </div>
      </Card>

      {/* Card 3: Ditolak Permanen */}
      <Card className="border border-border/60 bg-card shadow-xs p-5">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Ditolak Permanen
          </span>
          <div className="text-3xl font-extrabold text-foreground">
            {isLoading ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              stats.permanentRejectedCount
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
