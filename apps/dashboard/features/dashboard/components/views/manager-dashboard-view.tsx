"use client";

import React, { useState } from "react";
import { useDashboardData } from "../../hooks/use-dashboard-data";
import { ManagerHeaderBanner } from "../manager/manager-header-banner";
import { PeriodFilter } from "../manager/period-filter";
import { PrimaryMetrics } from "../manager/primary-metrics";
import { SecondaryMetrics } from "../manager/secondary-metrics";
import { YearlyStatsChart } from "../manager/yearly-stats-chart";
import { DocumentDistributionChart } from "../manager/document-distribution-chart";
import { QCPerformanceSection } from "../manager/qc-performance-section";
import { StatusAlerts } from "../manager/status-alerts";
import { NotificationsCard } from "../manager/notifications-card";
import type { PeriodType } from "../../types/dashboard.types";

export function ManagerDashboardView() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("hari");
  const {
    isLoading,
    primaryMetrics,
    secondaryMetrics,
    yearlyStats,
    documentTypes,
    qcStaffData,
    notificationsData,
  } = useDashboardData();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* 1. Header Banner */}
      <ManagerHeaderBanner />

      {/* 2. Period Filter Bar */}
      <PeriodFilter
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
      />

      {/* 3. Key Metrics Grid - Row 1 */}
      <PrimaryMetrics isLoading={isLoading} metrics={primaryMetrics} />

      {/* 4. Secondary Operational Metrics Grid - Row 2 */}
      <SecondaryMetrics isLoading={isLoading} metrics={secondaryMetrics} />

      {/* 5. Charts & Visualizations Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <YearlyStatsChart isLoading={isLoading} data={yearlyStats} />
        <DocumentDistributionChart isLoading={isLoading} data={documentTypes} />
      </div>

      {/* 6. QC Staff Performance Section & Detail Table */}
      <QCPerformanceSection isLoading={isLoading} data={qcStaffData} />

      {/* 7. Verification Status & Notifications Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusAlerts isLoading={isLoading} />
        <NotificationsCard isLoading={isLoading} notifications={notificationsData} />
      </div>
    </div>
  );
}
