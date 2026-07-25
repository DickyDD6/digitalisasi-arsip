"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2, AlertCircle, Info, AlertTriangle, Check, ExternalLink } from "lucide-react";
import { authQueries } from "@/features/auth/queries/auth.queries";
import { dashboardQueries } from "@/features/dashboard/queries/dashboard.queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const READ_NOTIFS_KEY = "digital_archive_read_notifications";

export function NotificationsDropdown() {
  const { data: user } = useQuery(authQueries.userMe());
  const role = user?.role || "manager";

  const auditQuery = useQuery(dashboardQueries.auditLogStats());
  const pendingQuery = useQuery(dashboardQueries.pendingDocuments(5, 1));

  const [readIds, setReadIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(READ_NOTIFS_KEY);
      if (saved) {
        setReadIds(JSON.parse(saved));
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to load read notifications from localStorage:", error);
      }
    }
  }, []);

  const saveReadIds = (ids: number[]) => {
    setReadIds(ids);
    try {
      localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(ids));
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to save read notifications to localStorage:", error);
      }
    }
  };

  const auditLogs = auditQuery.data?.data?.recent_activities || [];
  const pendingDocs = pendingQuery.data?.data || [];

  const notifications = React.useMemo(() => {
    if (role === "qc" && pendingDocs.length > 0) {
      return pendingDocs.slice(0, 5).map((doc) => ({
        id: doc.id,
        title: "Dokumen Perlu Verifikasi",
        message: `${doc.title || doc.file_name || "Dokumen"} menunggu verifikasi QC.`,
        time: "Baru saja",
        type: "warning" as const,
      }));
    }

    if (role === "uploader") {
      return [
        {
          id: 101,
          title: "Status Dokumen",
          message: "Dokumen terbaru Anda telah berhasil diunggah ke sistem.",
          time: "5 Menit lalu",
          type: "success" as const,
        },
        {
          id: 102,
          title: "Pengingat Template",
          message: "Gunakan template transkrip standar versi 2026 untuk upload baru.",
          time: "1 Jam lalu",
          type: "info" as const,
        },
      ];
    }

    if (role === "sbap") {
      return [
        {
          id: 201,
          title: "Arsip Baru Siap Cetak",
          message: "Transkrip nilai mahasiswa baru diverifikasi dan siap diunduh.",
          time: "10 Menit lalu",
          type: "success" as const,
        },
      ];
    }

    return auditLogs.slice(0, 5).map((log, idx) => {
      const actionStr =
        typeof log.action === "string"
          ? log.action
          : typeof log.action === "object" && log.action?.name
            ? String(log.action.name)
            : "";

      return {
        id: log.id || idx,
        title: log.user?.name ? `Aktivitas ${log.user.name}` : "Aktivitas Sistem",
        message: log.description || "Aktivitas sistem baru tercatat.",
        time: log.date?.time ? `${log.date.time} WIB` : "Baru saja",
        type: actionStr.includes("reject") || actionStr.includes("delete")
          ? ("destructive" as const)
          : actionStr.includes("verify")
            ? ("success" as const)
            : ("info" as const),
      };
    });
  }, [role, auditLogs, pendingDocs]);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const markAllAsRead = () => {
    const allIds = Array.from(new Set([...readIds, ...notifications.map((n) => n.id)]));
    saveReadIds(allIds);
  };

  const markSingleAsRead = (id: number) => {
    if (!readIds.includes(id)) {
      saveReadIds([...readIds, id]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 shadow-lg border border-border/60">
        <DropdownMenuLabel className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifikasi</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 text-[10px]">
                {unreadCount} baru
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <Check className="w-3 h-3 mr-1" />
              Tandai dibaca
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {notifications.length > 0 ? (
            notifications.map((item) => {
              const isRead = readIds.includes(item.id);
              return (
                <DropdownMenuItem
                  key={item.id}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${isRead ? "opacity-60 bg-transparent" : "bg-muted/30"
                    }`}
                  onClick={() => markSingleAsRead(item.id)}
                >
                  {item.type === "destructive" ? (
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  ) : item.type === "warning" ? (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : item.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">{item.title}</p>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Tidak ada notifikasi baru.
            </div>
          )}
        </div>

        {/* Bottom Button: See All Notifications */}
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2 bg-muted/20 text-center">
          <Button
            variant="ghost"
            className="w-full text-xs text-[#F54A00] hover:text-[#d64100] hover:bg-[#F54A00]/10 font-medium justify-center h-8 gap-1.5"
          >
            <Link href="/notifications">
              Lihat Semua Notifikasi
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
