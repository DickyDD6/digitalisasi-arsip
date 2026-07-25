"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useDashboardData } from "../../hooks/use-dashboard-data";
import { ManagerHeaderBanner } from "../manager/manager-header-banner";
import { PeriodFilter } from "../manager/period-filter";
import { PrimaryMetrics } from "../manager/primary-metrics";
import { SecondaryMetrics } from "../manager/secondary-metrics";
import { StatusAlerts } from "../manager/status-alerts";
import { NotificationsCard } from "../manager/notifications-card";
import { Skeleton } from "@repo/ui/skeleton";
import type { PeriodType } from "../../types/dashboard.types";

// Dynamic imports for heavy recharts components to optimize initial bundle size & LCP
const YearlyStatsChart = dynamic(
  () => import("../manager/yearly-stats-chart").then((m) => m.YearlyStatsChart),
  {
    loading: () => <Skeleton className="h-[350px] w-full rounded-xl col-span-2" />,
    ssr: false,
  }
);

const DocumentDistributionChart = dynamic(
  () =>
    import("../manager/document-distribution-chart").then(
      (m) => m.DocumentDistributionChart
    ),
  {
    loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
    ssr: false,
  }
);

const QCPerformanceSection = dynamic(
  () => import("../manager/qc-performance-section").then((m) => m.QCPerformanceSection),
  {
    loading: () => <Skeleton className="h-[280px] w-full rounded-xl" />,
    ssr: false,
  }
);

export function ManagerDashboardView() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("hari");
  const [customDates, setCustomDates] = useState<{ start?: string; end?: string }>({});

  const handleSelectPeriod = (period: PeriodType, startDate?: string, endDate?: string) => {
    setSelectedPeriod(period);
    if (period === "custom" && startDate && endDate) {
      setCustomDates({ start: startDate, end: endDate });
    }
  };

  const dates = useMemo(() => {
    if (selectedPeriod === "custom" && customDates.start && customDates.end) {
      return { startDate: customDates.start, endDate: customDates.end };
    }
    const now = new Date();
    const end = now.toISOString().split("T")[0];
    let start: string | undefined;

    if (selectedPeriod === "hari") {
      start = end;
    } else if (selectedPeriod === "minggu") {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      start = d.toISOString().split("T")[0];
    } else if (selectedPeriod === "bulan") {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      start = d.toISOString().split("T")[0];
    }

    return { startDate: start, endDate: end };
  }, [selectedPeriod, customDates]);

  const periodLabel = useMemo(() => {
    if (selectedPeriod === "hari") return "Hari Ini";
    if (selectedPeriod === "minggu") return "Minggu Ini";
    if (selectedPeriod === "bulan") return "Bulan Ini";
    if (selectedPeriod === "custom" && customDates.start && customDates.end) {
      return `${customDates.start} s/d ${customDates.end}`;
    }
    return "Periode Aktif";
  }, [selectedPeriod, customDates]);

  const {
    isLoading,
    primaryMetrics,
    secondaryMetrics,
    yearlyStats,
    documentTypes,
    qcStaffData,
    notificationsData,
  } = useDashboardData(dates.startDate, dates.endDate);

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* 1. Header Banner */}
      <ManagerHeaderBanner />

      {/* 2. Period Filter Bar */}
      <PeriodFilter
        selectedPeriod={selectedPeriod}
        onSelectPeriod={handleSelectPeriod}
        customStartDate={customDates.start}
        customEndDate={customDates.end}
      />

      {/* 3. Key Metrics Grid - Row 1 */}
      <PrimaryMetrics isLoading={isLoading} metrics={primaryMetrics} />

      {/* 4. Secondary Operational Metrics Grid - Row 2 */}
      <SecondaryMetrics isLoading={isLoading} metrics={secondaryMetrics} />

      {/* 5. Charts & Visualizations Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <YearlyStatsChart isLoading={isLoading} data={yearlyStats} periodLabel={periodLabel} />
        <DocumentDistributionChart isLoading={isLoading} data={documentTypes} />
      </div>

      {/* 6. QC Staff Performance Section & Detail Table */}
      <QCPerformanceSection isLoading={isLoading} data={qcStaffData} />

      {/* 7. Verification Status & Notifications Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusAlerts isLoading={isLoading} pendingDocuments={primaryMetrics.pendingDocuments} />
        <NotificationsCard isLoading={isLoading} notifications={notificationsData} />
      </div>
    </div>
  );
}
