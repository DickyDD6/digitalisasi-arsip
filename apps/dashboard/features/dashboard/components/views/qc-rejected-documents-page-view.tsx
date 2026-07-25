"use client";

import React, { useState } from "react";
import { FileX, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Skeleton } from "@repo/ui/skeleton";
import { useQCRejectedDocuments } from "../../hooks/use-qc-rejected-documents";
import { QCRejectedDocumentStats } from "../qc/qc-rejected-document-stats";
import { QCRejectedDocumentFilter } from "../qc/qc-rejected-document-filter";
import { QCRejectedDocumentItem } from "../qc/qc-rejected-document-item";
import { ViewArchiveModal } from "@/features/archives/components/ui/view-archive-modal";
import type { QCFilterCategoryOption } from "../qc/qc-verified-document-filter";

export function QCRejectedDocumentsPageView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<QCFilterCategoryOption>("all");
  const [viewModalDocId, setViewModalDocId] = useState<number | null>(null);

  const { isLoading, rejectedDocs, refetchRejected, stats } = useQCRejectedDocuments({
    search: searchQuery,
    categoryFilter,
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* 1. Header Banner */}
      <Card className="border border-border/60 bg-card shadow-xs">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileX className="w-6 h-6 text-[#E7000B]" />
                <span>Dokumen Ditolak</span>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Daftar seluruh dokumen yang ditolak beserta catatan dan alasan penolakan dari Tim Quality Control
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchRejected()}
              className="gap-1.5 text-xs h-9 self-start sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 2. Stat Summary Cards */}
      <QCRejectedDocumentStats stats={stats} isLoading={isLoading} />

      {/* 3. Search & Category Tabs Filter */}
      <QCRejectedDocumentFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        totalCount={stats.total}
      />

      {/* 4. Rejected Document Cards Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>Daftar Dokumen Ditolak</span>
            <Badge variant="secondary" className="font-normal text-xs bg-rose-500/10 text-rose-600">
              {rejectedDocs.length} Dokumen
            </Badge>
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 space-y-4 border border-border/50">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-64" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </Card>
            ))}
          </div>
        ) : rejectedDocs.length > 0 ? (
          <div className="space-y-4">
            {rejectedDocs.map((doc) => (
              <QCRejectedDocumentItem
                key={doc.id}
                doc={doc}
                onOpenView={(d) => setViewModalDocId(d.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border border-border/60">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-3">
                <FileX className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">Tidak Ada Dokumen Ditolak</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Tidak ada catatan dokumen yang ditolak untuk kriteria pencarian ini.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

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
