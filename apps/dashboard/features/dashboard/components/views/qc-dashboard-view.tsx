"use client";

import React from "react";
import { useQCDashboard } from "../../hooks/use-qc-dashboard";
import { QCHeaderBanner } from "../qc/qc-header-banner";
import { QCSummaryMetrics } from "../qc/qc-summary-metrics";
import { QCPendingDocumentsTable } from "../qc/qc-pending-documents-table";

export function QCDashboardView() {
  const {
    isLoading,
    stats,
    pendingDocs,
    refetchPending,
    verifyDocument,
    isVerifying,
  } = useQCDashboard();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* 1. Header Banner */}
      <QCHeaderBanner />

      {/* 2. QC Stat Cards */}
      <QCSummaryMetrics
        stats={stats}
        fallbackPendingCount={pendingDocs.length}
        isLoading={isLoading}
      />

      {/* 3. Pending Verification Queue Table */}
      <QCPendingDocumentsTable
        pendingDocs={pendingDocs}
        isLoading={isLoading}
        onRefresh={refetchPending}
        onVerify={verifyDocument}
        isVerifying={isVerifying}
      />
    </div>
  );
}
