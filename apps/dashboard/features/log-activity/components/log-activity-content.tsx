"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "@/features/dashboard/queries/dashboard.queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Skeleton } from "@repo/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table";
import {
  Activity,
  FileCheck,
  FileX,
  Upload,
  RotateCcw,
  SlidersHorizontal,
  UserCheck,
  AlertTriangle,
  Info,
} from "lucide-react";

export const LogActivityContent = () => {
  const [filterAction, setFilterAction] = useState<string | undefined>(undefined);

  const auditLogQuery = useQuery(dashboardQueries.auditLogStats());
  const docStatsQuery = useQuery(dashboardQueries.documentStats());

  const isLoading = auditLogQuery.isLoading || docStatsQuery.isLoading;

  const auditData = auditLogQuery.data?.data;
  const docStats = docStatsQuery.data?.data;

  const recentActivities = auditData?.recent_activities || [];

  const filteredActivities = filterAction
    ? recentActivities.filter((item) => {
      const actionStr = typeof item.action === "string" ? item.action : item.action?.name || "";
      return actionStr.toLowerCase().includes(filterAction.toLowerCase());
    })
    : recentActivities;

  return (
    <div className="space-y-6">
      {/* 1. Filter Bar */}
      <Card className="border border-border/60 bg-card shadow-sm">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter Aksi:
            </span>
            <Button
              variant={filterAction === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterAction(undefined)}
              className={filterAction === undefined ? "h-8 text-xs bg-[#F54A00] text-white" : "h-8 text-xs"}
            >
              Semua Aksi
            </Button>
            <Button
              variant={filterAction === "verify" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterAction("verify")}
              className={filterAction === "verify" ? "h-8 text-xs bg-[#F54A00] text-white" : "h-8 text-xs"}
            >
              Verifikasi
            </Button>
            <Button
              variant={filterAction === "upload" || filterAction === "create" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterAction("upload")}
              className={filterAction === "upload" ? "h-8 text-xs bg-[#F54A00] text-white" : "h-8 text-xs"}
            >
              Upload / Tambah
            </Button>
            <Button
              variant={filterAction === "reject" || filterAction === "delete" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterAction("reject")}
              className={filterAction === "reject" ? "h-8 text-xs bg-[#F54A00] text-white" : "h-8 text-xs"}
            >
              Ditolak / Hapus
            </Button>
          </div>

          {filterAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterAction(undefined)}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filter
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 2. Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card shadow-sm p-5">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Aktivitas Hari Ini</p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {auditData?.today_total ?? recentActivities.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>

        <Card className="border border-border/60 bg-card shadow-sm p-5">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Dokumen Arsip</p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {docStats?.total_documents ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Upload className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>

        <Card className="border border-border/60 bg-card shadow-sm p-5">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Terverifikasi QC</p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                  {docStats?.verified_documents ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>

        <Card className="border border-border/60 bg-card shadow-sm p-5">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Ditolak / Invalid</p>
                <p className="text-2xl font-bold tracking-tight text-rose-600 mt-1">
                  {docStats?.rejected_documents ?? 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <FileX className="w-5 h-5" />
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 3. Monitoring Table Card */}
      <Card className="border border-border/60 bg-card shadow-sm">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Audit Trail &amp; Log Aktivitas Sistem
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Daftar seluruh aktivitas pengguna terbaru yang tercatat oleh sistem
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Pengguna</TableHead>
                <TableHead className="w-[180px]">Aksi / Event</TableHead>
                <TableHead>Deskripsi Aktivitas</TableHead>
                <TableHead className="w-[150px] text-right">Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredActivities.length > 0 ? (
                filteredActivities.map((log, idx) => {
                  const actionStr =
                    typeof log.action === "string"
                      ? log.action
                      : typeof log.action === "object" && log.action?.name
                        ? String(log.action.name)
                        : "Aktivitas";

                  const isDestructive =
                    actionStr.includes("reject") ||
                    actionStr.includes("delete") ||
                    actionStr.includes("destroy");
                  const isSuccess =
                    actionStr.includes("verify") || actionStr.includes("create") || actionStr.includes("store");

                  let timeStr = "-";
                  if (log.date?.time) {
                    timeStr = `${log.date.time} WIB`;
                  } else if (log.created_at) {
                    try {
                      timeStr = new Date(log.created_at).toLocaleString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "short",
                      });
                    } catch {
                      timeStr = "-";
                    }
                  }

                  return (
                    <TableRow key={log.id || idx} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">
                              {log.user?.name || "Sistem"}
                            </p>
                            {log.user?.email && (
                              <p className="text-[10px] text-muted-foreground">{log.user.email}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            isDestructive
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px]"
                              : isSuccess
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px]"
                          }
                        >
                          {isDestructive ? (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          ) : isSuccess ? (
                            <FileCheck className="w-3 h-3 mr-1" />
                          ) : (
                            <Info className="w-3 h-3 mr-1" />
                          )}
                          {actionStr.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-foreground leading-relaxed">
                        {log.description || "Aktivitas sistem tercatat."}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground text-right whitespace-nowrap">
                        {timeStr}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-xs text-muted-foreground">
                    Tidak ditemukan log aktivitas yang sesuai.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
