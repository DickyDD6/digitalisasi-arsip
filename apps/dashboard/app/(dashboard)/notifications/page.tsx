"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  CheckCheck,
  Trash2,
  SlidersHorizontal,
  Info,
  AlertTriangle,
} from "lucide-react";
import { authQueries } from "@/features/auth/queries/auth.queries";
import { dashboardQueries } from "@/features/dashboard/queries/dashboard.queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const READ_NOTIFS_KEY = "digital_archive_read_notifications";
const DELETED_NOTIFS_KEY = "digital_archive_deleted_notifications";

export default function NotificationsPage() {
  const { data: user } = useQuery(authQueries.userMe());
  const role = user?.role || "manager";

  const auditQuery = useQuery(dashboardQueries.auditLogStats());
  const pendingQuery = useQuery(dashboardQueries.pendingDocuments(10, 1));

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const [readIds, setReadIds] = useState<number[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const savedRead = localStorage.getItem(READ_NOTIFS_KEY);
      if (savedRead) setReadIds(JSON.parse(savedRead));

      const savedDeleted = localStorage.getItem(DELETED_NOTIFS_KEY);
      if (savedDeleted) setDeletedIds(JSON.parse(savedDeleted));
    } catch {
    }
  }, []);

  const saveReadIds = (ids: number[]) => {
    setReadIds(ids);
    try {
      localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(ids));
    } catch {
    }
  };

  const saveDeletedIds = (ids: number[]) => {
    setDeletedIds(ids);
    try {
      localStorage.setItem(DELETED_NOTIFS_KEY, JSON.stringify(ids));
    } catch {
    }
  };

  const auditLogs = auditQuery.data?.data?.recent_activities || [];
  const pendingDocs = pendingQuery.data?.data || [];

  const rawNotifications = useMemo(() => {
    const list: Array<{
      id: number;
      category: "System" | "Upload" | "Verifikasi" | "User" | "Archive";
      priority: "Penting" | "Sedang" | "Rendah";
      title: string;
      message: string;
      time: string;
      isToday: boolean;
      type: "destructive" | "warning" | "success" | "info";
    }> = [];

    list.push({
      id: 991,
      category: "System",
      priority: "Penting",
      title: "Sistem Maintenance Terjadwal",
      message: "Sistem akan mengalami pemeliharaan rutin pada akhir pekan ini pukul 00:00 - 04:00 WIB.",
      time: "5 Menit yang Lalu",
      isToday: true,
      type: "warning",
    });

    if (pendingDocs.length > 0) {
      pendingDocs.slice(0, 5).forEach((doc) => {
        list.push({
          id: doc.id + 1000,
          category: "Verifikasi",
          priority: "Penting",
          title: "Dokumen Memerlukan Verifikasi",
          message: `${doc.title || doc.file_name || "Dokumen"} diunggah oleh ${doc.uploader?.name || "Tim Uploader"} menunggu verifikasi QC.`,
          time: "2 Jam yang Lalu",
          isToday: true,
          type: "warning",
        });
      });
    }

    auditLogs.forEach((log, idx) => {
      const actionStr =
        typeof log.action === "string"
          ? log.action
          : typeof log.action === "object" && log.action?.name
            ? String(log.action.name)
            : "";

      const category: "System" | "Upload" | "Verifikasi" | "User" | "Archive" =
        actionStr.includes("upload")
          ? "Upload"
          : actionStr.includes("verify")
            ? "Verifikasi"
            : actionStr.includes("user")
              ? "User"
              : actionStr.includes("delete") || actionStr.includes("archive")
                ? "Archive"
                : "System";

      const priority: "Penting" | "Sedang" | "Rendah" =
        actionStr.includes("delete") || actionStr.includes("reject")
          ? "Penting"
          : actionStr.includes("verify") || actionStr.includes("upload")
            ? "Sedang"
            : "Rendah";

      list.push({
        id: log.id || idx + 100,
        category,
        priority,
        title: log.user?.name ? `Aktivitas ${log.user.name}` : "Aktivitas Sistem",
        message: log.description || "Aktivitas sistem tercatat.",
        time: log.date?.time ? `${log.date.time} WIB` : "Hari ini",
        isToday: true,
        type: actionStr.includes("reject") || actionStr.includes("delete")
          ? "destructive"
          : actionStr.includes("verify")
            ? "success"
            : "info",
      });
    });

    return list;
  }, [auditLogs, pendingDocs]);

  const activeList = useMemo(() => {
    return rawNotifications.filter((n) => !deletedIds.includes(n.id));
  }, [rawNotifications, deletedIds]);

  const totalCount = activeList.length;
  const unreadCount = activeList.filter((n) => !readIds.includes(n.id)).length;
  const highPriorityCount = activeList.filter((n) => n.priority === "Penting").length;
  const todayCount = activeList.filter((n) => n.isToday).length;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: totalCount };
    activeList.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [activeList, totalCount]);

  const filteredNotifications = useMemo(() => {
    return activeList.filter((item) => {
      if (activeTab === "unread" && readIds.includes(item.id)) return false;

      if (activeCategory !== "Semua" && item.category !== activeCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMsg = item.message.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg) return false;
      }

      return true;
    });
  }, [activeList, readIds, activeTab, activeCategory, searchQuery]);

  const handleMarkAllAsRead = () => {
    const allIds = Array.from(new Set([...readIds, ...activeList.map((n) => n.id)]));
    saveReadIds(allIds);
    toast.success("Semua notifikasi ditandai telah dibaca.");
  };

  const handleToggleRead = (id: number) => {
    if (readIds.includes(id)) {
      saveReadIds(readIds.filter((item) => item !== id));
    } else {
      saveReadIds([...readIds, id]);
    }
  };

  const handleDelete = (id: number) => {
    saveDeletedIds([...deletedIds, id]);
    toast.success("Notifikasi dihapus.");
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* 1. Header Card */}
      <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
        <CardHeader className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Notifikasi
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Kelola dan pantau semua notifikasi sistem digital arsip
              </CardDescription>
            </div>
            <Button
              onClick={handleMarkAllAsRead}
              className="bg-[#F54A00] hover:bg-[#d64100] text-white shadow-sm font-medium gap-2 self-start md:self-auto"
            >
              <CheckCheck className="w-4 h-4" />
              Tandai Semua Telah Dibaca
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 2. Summary Cards Grid (Matching Figma #1571:11631 screenshot exact design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Notifikasi Card */}
        <Card className="border border-border/60 bg-card shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-normal">Total Notifikasi</p>
              <p className="text-2xl font-semibold tracking-tight text-[#155DFC]">
                {totalCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#155DFC] dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Belum Dibaca Card */}
        <Card className="border border-border/60 bg-card shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-normal">Belum Dibaca</p>
              <p className="text-2xl font-semibold tracking-tight text-[#F54A00]">
                {unreadCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFEDD4] text-[#F54A00] dark:bg-orange-950 dark:text-orange-300 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Prioritas Tinggi Card */}
        <Card className="border border-border/60 bg-card shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-normal">Prioritas Tinggi</p>
              <p className="text-2xl font-semibold tracking-tight text-[#E7000B]">
                {highPriorityCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFE2E2] text-[#E7000B] dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Hari Ini Card */}
        <Card className="border border-border/60 bg-card shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-normal">Hari Ini</p>
              <p className="text-2xl font-semibold tracking-tight text-[#00A63E]">
                {todayCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#00A63E] dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <Input
            placeholder="Cari Notifikasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl border-border/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["Semua", "System", "Upload", "Verifikasi", "User", "Archive"].map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? "h-8 text-xs rounded-xl bg-[#F54A00] text-white font-medium gap-1.5"
                  : "h-8 text-xs rounded-xl bg-card border-border/60 font-normal gap-1.5 text-muted-foreground hover:text-foreground"
              }
            >
              {cat}
              <Badge
                variant="secondary"
                className={
                  activeCategory === cat
                    ? "bg-white/20 text-white text-[10px] px-1.5 py-0"
                    : "bg-muted text-muted-foreground text-[10px] px-1.5 py-0"
                }
              >
                {categoryCounts[cat] || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* 4. Notifications List Card */}
      <Card className="border border-border/60 bg-card shadow-sm overflow-hidden">
        {/* Read / Unread Tabs Header */}
        <div className="grid grid-cols-2 border-b border-border/60 bg-muted/40">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-3.5 text-xs font-semibold text-center transition-colors border-b-2 ${activeTab === "all"
                ? "border-[#F54A00] text-[#F54A00] bg-card"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            Semua ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`py-3.5 text-xs font-semibold text-center transition-colors border-b-2 ${activeTab === "unread"
                ? "border-[#F54A00] text-[#F54A00] bg-card"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>

        <CardContent className="p-0 divide-y divide-border/60">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const isRead = readIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isRead ? "bg-card opacity-75" : "bg-muted/30"
                    }`}
                >
                  <div className="flex items-start gap-3.5">
                    {item.type === "destructive" ? (
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    ) : item.type === "warning" ? (
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    ) : item.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.message}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                        <span>{item.time}</span>
                        <span>•</span>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleToggleRead(item.id)}
                          className="h-auto p-0 text-[11px] text-[#F54A00] font-medium"
                        >
                          {isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                        </Button>
                        <span>•</span>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="h-auto p-0 text-[11px] text-rose-600 font-medium"
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge
                      variant="secondary"
                      className={
                        item.priority === "Penting"
                          ? "bg-rose-100 text-rose-700 border-rose-200 text-[11px]"
                          : item.priority === "Sedang"
                            ? "bg-amber-100 text-amber-700 border-amber-200 text-[11px]"
                            : "bg-gray-100 text-gray-700 border-gray-200 text-[11px]"
                      }
                    >
                      {item.priority}
                    </Badge>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Tidak ada notifikasi</p>
              <p>Tidak ada notifikasi yang sesuai dengan filter saat ini.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
