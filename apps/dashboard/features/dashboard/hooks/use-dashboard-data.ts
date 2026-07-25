import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "../queries/dashboard.queries";
import type {
  YearlyStat,
  DocumentTypeStat,
  QCStaffStat,
  NotificationItem,
} from "../types/dashboard.types";

export function useDashboardData(startDate?: string, endDate?: string) {
  const reportsStatsQuery = useQuery(dashboardQueries.stats(startDate, endDate));
  const docStatsQuery = useQuery(dashboardQueries.documentStats());
  const auditLogStatsQuery = useQuery(dashboardQueries.auditLogStats(startDate, endDate));
  const userStatsQuery = useQuery(dashboardQueries.userStats());

  const isLoading =
    reportsStatsQuery.isLoading ||
    docStatsQuery.isLoading ||
    auditLogStatsQuery.isLoading ||
    userStatsQuery.isLoading;

  const docApi = reportsStatsQuery.data?.data || docStatsQuery.data?.data;
  const auditApi = auditLogStatsQuery.data?.data;
  const userApi = userStatsQuery.data?.data;

  const primaryMetrics = {
    totalDocuments: docApi?.total_documents ?? 0,
    verifiedDocuments: docApi?.verified_documents ?? 0,
    pendingDocuments: docApi?.pending_documents ?? 0,
    rejectedDocuments: docApi?.rejected_documents ?? 0,
  };

  const secondaryMetrics = {
    todayActivity: auditApi?.today_total ?? 0,
    avgVerifyTime: "0 Hari",
    activeStaffRatio:
      userApi?.active_users !== undefined && userApi?.total_users !== undefined
        ? `${userApi.active_users}/${userApi.total_users}`
        : "0/0",
    urgentCount: docApi?.pending_documents ?? 0,
  };

  const apiNotifications: NotificationItem[] = auditApi?.recent_activities?.length
    ? auditApi.recent_activities.map((log, idx) => {
      const actionStr =
        typeof log.action === "string"
          ? log.action
          : typeof log.action === "object" && log.action?.name
            ? String(log.action.name)
            : typeof log.action === "object" && log.action?.label
              ? String(log.action.label)
              : "";

      const isDestructive =
        actionStr.includes("reject") ||
        actionStr.includes("delete") ||
        actionStr.includes("destroy");
      const isSuccess =
        actionStr.includes("verify") || actionStr.includes("create") || actionStr.includes("store");

      let timeStr: string;
      if (log.date?.time) {
        timeStr = `${log.date.time} WIB`;
      } else if (log.created_at) {
        try {
          timeStr = new Date(log.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB";
        } catch {
          timeStr = "-";
        }
      } else {
        timeStr = "-";
      }

      return {
        id: log.id || idx,
        title: log.user?.name ? `Aktivitas ${log.user.name}` : "Aktivitas Sistem",
        message: log.description || "Aktivitas sistem tercatat",
        time: timeStr,
        type: isDestructive ? "destructive" : isSuccess ? "success" : "info",
        iconName: isDestructive ? "alert-triangle" : isSuccess ? "check-circle" : "info",
        bgColor: isDestructive
          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800"
          : isSuccess
            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
            : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
        textColor: isDestructive
          ? "text-rose-800 dark:text-rose-300"
          : isSuccess
            ? "text-emerald-800 dark:text-emerald-300"
            : "text-blue-800 dark:text-blue-300",
        iconColor: isDestructive
          ? "text-rose-600 dark:text-rose-400"
          : isSuccess
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-blue-600 dark:text-blue-400",
        href: isDestructive
          ? "/rejected-documents"
          : isSuccess
            ? "/verified-documents"
            : "/log-activity",
      };
    })
    : [];

  const yearlyStats: YearlyStat[] = [];
  const documentTypes: DocumentTypeStat[] = [];
  const qcStaffData: QCStaffStat[] = [];

  return {
    isLoading,
    primaryMetrics,
    secondaryMetrics,
    yearlyStats,
    documentTypes,
    qcStaffData,
    notificationsData: apiNotifications,
    refetch: () => {
      reportsStatsQuery.refetch();
      docStatsQuery.refetch();
      auditLogStatsQuery.refetch();
      userStatsQuery.refetch();
    },
  };
}
