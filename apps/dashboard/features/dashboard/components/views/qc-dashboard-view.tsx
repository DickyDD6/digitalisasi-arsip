"use client";

import React from "react";
import { useQCDashboard } from "../../hooks/use-qc-dashboard";
import { QCHeaderBanner } from "../qc/qc-header-banner";
import { QCSummaryMetrics } from "../qc/qc-summary-metrics";
import { QCQuickAccessBanner } from "../qc/qc-quick-access-banner";
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

      {/* 2. QC Stat Cards (Figma 4 Cards) */}
      <QCSummaryMetrics
        stats={stats}
        fallbackPendingCount={pendingDocs.length}
        isLoading={isLoading}
      />

      {/* 3. Quick Access Gradient Cards (Figma SR-03.01 - SR-03.04) */}
      <QCQuickAccessBanner pendingCount={pendingDocs.length} />

      {/* 4. Pending Verification Queue List */}
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
