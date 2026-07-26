"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@repo/ui/card";
import { ViewArchiveModal } from "@/features/archives/components/ui/view-archive-modal";
import { useDocumentList } from "../hooks/use-document-list";
import { useDocumentDownload } from "../hooks/use-document-download";
import { DocumentListHeader } from "./document-list/document-list-header";
import { DocumentListMetrics } from "./document-list/document-list-metrics";
import { DocumentListFilters } from "./document-list/document-list-filters";
import { DocumentListTable } from "./document-list/document-list-table";
import { DocumentListPagination } from "./document-list/document-list-pagination";

export function UploaderDocumentListView() {
  const {
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    stats,
    isStatsLoading,
    documents,
    meta,
    isLoading,
  } = useDocumentList();

  const { handleDownload } = useDocumentDownload();

  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const handleView = (id: number) => {
    setSelectedDocId(id);
    setViewModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <DocumentListHeader />

      <DocumentListMetrics stats={stats} isLoading={isStatsLoading} />

      <Card className="border border-border/60 bg-card shadow-sm overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <DocumentListFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
          <DocumentListTable
            documents={documents}
            isLoading={isLoading}
            onView={handleView}
            onDownload={handleDownload}
          />
          <DocumentListPagination
            meta={meta}
            page={page}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {selectedDocId && (
        <ViewArchiveModal
          id={selectedDocId}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
        />
      )}
    </div>
  );
}
