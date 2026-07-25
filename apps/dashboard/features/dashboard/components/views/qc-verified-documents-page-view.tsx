"use client";

import React, { useState } from "react";
import { FileCheck, RefreshCw } from "lucide-react";
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
import { useQCVerifiedDocuments } from "../../hooks/use-qc-verified-documents";
import { QCVerifiedDocumentStats } from "../qc/qc-verified-document-stats";
import { QCVerifiedDocumentFilter, type QCFilterCategoryOption } from "../qc/qc-verified-document-filter";
import { QCVerifiedDocumentItem } from "../qc/qc-verified-document-item";
import { ViewArchiveModal } from "@/features/archives/components/ui/view-archive-modal";

export function QCVerifiedDocumentsPageView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<QCFilterCategoryOption>("all");
  const [viewModalDocId, setViewModalDocId] = useState<number | null>(null);

  const { isLoading, verifiedDocs, refetchVerified, stats } = useQCVerifiedDocuments({
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
                <FileCheck className="w-6 h-6 text-[#00C951]" />
                <span>Dokumen Terverifikasi</span>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Daftar seluruh arsip dokumen yang telah memenuhi standar Quality Control dan terverifikasi
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchVerified()}
              className="gap-1.5 text-xs h-9 self-start sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 2. Stat Summary Cards */}
      <QCVerifiedDocumentStats stats={stats} isLoading={isLoading} />

      {/* 3. Search & Category Tabs Filter */}
      <QCVerifiedDocumentFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        totalCount={stats.total}
      />

      {/* 4. Verified Document Cards Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>Daftar Dokumen Terverifikasi</span>
            <Badge variant="secondary" className="font-normal text-xs bg-emerald-500/10 text-emerald-600">
              {verifiedDocs.length} Dokumen
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
                <Skeleton className="h-24 w-full rounded-xl" />
              </Card>
            ))}
          </div>
        ) : verifiedDocs.length > 0 ? (
          <div className="space-y-4">
            {verifiedDocs.map((doc) => (
              <QCVerifiedDocumentItem
                key={doc.id}
                doc={doc}
                onOpenView={(d) => setViewModalDocId(d.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border border-border/60">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                <FileCheck className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">Tidak Ada Dokumen Terverifikasi</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Belum ada dokumen yang sesuai dengan kriteria pencarian atau kategori ini.
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
