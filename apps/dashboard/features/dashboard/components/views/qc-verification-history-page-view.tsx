"use client";

import React, { useState } from "react";
import { History, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQCVerificationHistory } from "../../hooks/use-qc-verification-history";
import { QCVerificationHistoryStats } from "../qc/qc-verification-history-stats";
import { QCVerificationHistoryFilter } from "../qc/qc-verification-history-filter";
import { QCVerificationHistoryItem } from "../qc/qc-verification-history-item";
import { ViewArchiveModal } from "@/features/archives/components/ui/view-archive-modal";

export function QCVerificationHistoryPageView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "rejected">("all");
  const [viewModalDocId, setViewModalDocId] = useState<number | null>(null);

  // Fetch live API verification history using React Query hook
  const { isLoading, historyDocs, refetchHistory, stats } = useQCVerificationHistory({
    search: searchQuery,
    statusFilter,
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* 1. Header Card */}
      <Card className="border border-border/60 bg-card shadow-xs">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <History className="w-6 h-6 text-amber-600" />
                <span>Riwayat Verifikasi Dokumen</span>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Daftar seluruh riwayat verifikasi dan penolakan dokumen yang telah diproses oleh Tim QC
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchHistory()}
              className="gap-1.5 text-xs h-9 self-start sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 2. Stat Summary Cards */}
      <QCVerificationHistoryStats stats={stats} isLoading={isLoading} />

      {/* 3. Search & Status Tabs Filter */}
      <QCVerificationHistoryFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stats={stats}
      />

      {/* 4. History List Table Container */}
      <Card className="border border-border/60 bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-border/50">
          <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
            <span>Daftar Riwayat Verifikasi</span>
            <Badge variant="secondary" className="font-normal text-xs">
              {historyDocs.length} Hasil
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 space-y-2 border border-border/40 rounded-xl">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          ) : historyDocs.length > 0 ? (
            <div className="divide-y divide-border/50">
              {historyDocs.map((doc) => (
                <QCVerificationHistoryItem
                  key={doc.id}
                  doc={doc}
                  onOpenView={(d) => setViewModalDocId(d.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-14 px-6 text-center">
              <History className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-foreground">Tidak Ada Riwayat Verifikasi</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                Dokumen yang telah diverifikasi atau ditolak oleh QC akan secara otomatis tampil di sini.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {viewModalDocId && (
        <ViewArchiveModal
          id={viewModalDocId}
          open={!!viewModalDocId}
          onOpenChange={(open) => {
            if (!open) setViewModalDocId(null);
          }}
        />
      )}
    </div>
  );
}
