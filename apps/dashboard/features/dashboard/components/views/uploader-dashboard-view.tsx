"use client";

import React from "react";
import { ViewArchiveModal } from "@/features/archives/components/ui/view-archive-modal";
import { useUploaderDashboard } from "../../hooks/use-uploader-dashboard";
import { UploaderHeaderBanner } from "../uploader/uploader-header-banner";
import { UploaderSummaryMetrics } from "../uploader/uploader-summary-metrics";
import { UploaderQuickActions } from "../uploader/uploader-quick-actions";
import { UploaderRecentUploads } from "../uploader/uploader-recent-uploads";

export function UploaderDashboardView() {
  const {
    isLoading,
    stats,
    recentDocs,
    refetchRecent,
    selectedDocId,
    viewModalOpen,
    setViewModalOpen,
    handleOpenDetail,
  } = useUploaderDashboard();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* 1. Header Banner */}
      <UploaderHeaderBanner />

      {/* 2. 4 Summary Metric Cards */}
      <UploaderSummaryMetrics isLoading={isLoading} stats={stats} />

      {/* 3. 3 Quick Action Cards */}
      <UploaderQuickActions />

      {/* 4. Upload Terbaru List */}
      <UploaderRecentUploads
        isLoading={isLoading}
        documents={recentDocs}
        onRefetch={refetchRecent}
        onOpenDetail={handleOpenDetail}
      />

      {/* View Archive Detail Modal */}
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
