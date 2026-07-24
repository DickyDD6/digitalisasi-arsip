"use client";

import React from "react";
import { useSBAPDashboard } from "../../hooks/use-sbap-dashboard";
import { SBAPHeaderBanner } from "../sbap/sbap-header-banner";
import { SBAPSummaryMetrics } from "../sbap/sbap-summary-metrics";
import { SBAPVerifiedDocumentsTable } from "../sbap/sbap-verified-documents-table";

export function SBAPDashboardView() {
  const {
    searchTerm,
    setSearchTerm,
    isLoading,
    stats,
    verifiedDocs,
    refetchVerified,
    handleDownload,
  } = useSBAPDashboard();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* 1. Header Banner */}
      <SBAPHeaderBanner />

      {/* 2. SBAP Stat Cards */}
      <SBAPSummaryMetrics
        stats={stats}
        fallbackVerifiedCount={verifiedDocs.length}
        isLoading={isLoading}
      />

      {/* 3. Verified Documents Search & Download Table */}
      <SBAPVerifiedDocumentsTable
        verifiedDocs={verifiedDocs}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={refetchVerified}
        onDownload={handleDownload}
      />
    </div>
  );
}
