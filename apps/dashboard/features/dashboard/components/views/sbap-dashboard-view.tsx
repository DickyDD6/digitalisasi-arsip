"use client";

import React from "react";
import { useSBAPDashboard } from "../../hooks/use-sbap-dashboard";
import { SBAPHeaderBanner } from "../sbap/sbap-header-banner";
import { SBAPSummaryMetrics } from "../sbap/sbap-summary-metrics";
import { SBAPActionBanners } from "../sbap/sbap-action-banners";
import { SBAPRecentDownloadsCard } from "../sbap/sbap-recent-downloads-card";

export function SBAPDashboardView() {
  const { isLoading, stats, verifiedDocs, handleDownload } = useSBAPDashboard();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* 1. Header Banner */}
      <SBAPHeaderBanner />

      {/* 2. SBAP Top Stat Cards (4 Columns) */}
      <SBAPSummaryMetrics
        stats={stats}
        fallbackVerifiedCount={verifiedDocs.length}
        isLoading={isLoading}
      />

      {/* 3. SBAP Action Banners (2 Columns Grid) */}
      <SBAPActionBanners />

      {/* 4. Recent Downloads Log Card */}
      <SBAPRecentDownloadsCard onDownload={handleDownload} />
    </div>
  );
}
