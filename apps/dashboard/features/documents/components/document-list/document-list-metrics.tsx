import React from "react";
import { Card } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import type { DocumentStatisticsResponse } from "@/features/dashboard/types/dashboard.types";

type Stats = DocumentStatisticsResponse["data"] | undefined;

interface DocumentListMetricsProps {
  stats: Stats;
  isLoading: boolean;
}

const METRICS = [
  { key: "total_documents", label: "Total Dokumen", color: "text-foreground" },
  {
    key: "verified_documents",
    label: "Terverifikasi",
    color: "text-[#00A63E]",
  },
  { key: "pending_documents", label: "Menunggu", color: "text-[#D08700]" },
  { key: "rejected_documents", label: "Ditolak", color: "text-[#E7000B]" },
] as const;

export function DocumentListMetrics({
  stats,
  isLoading,
}: DocumentListMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <Card
            key={m.key}
            className="border border-border/60 bg-card shadow-sm p-5 space-y-2"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((m) => (
        <Card
          key={m.key}
          className="border border-border/60 bg-card shadow-sm p-5"
        >
          <p className="text-xs text-muted-foreground font-normal">{m.label}</p>
          <p className={`text-2xl font-bold tracking-tight mt-1 ${m.color}`}>
            {stats?.[m.key] ?? 0}
          </p>
        </Card>
      ))}
    </div>
  );
}
