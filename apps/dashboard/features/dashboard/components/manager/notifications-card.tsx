import React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, ExternalLink, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NotificationItem } from "../../types/dashboard.types";

interface NotificationsCardProps {
  isLoading?: boolean;
  notifications: NotificationItem[];
}

export function NotificationsCard({ isLoading, notifications }: NotificationsCardProps) {
  const getIcon = (iconName: NotificationItem["iconName"]) => {
    switch (iconName) {
      case "alert-circle":
        return AlertCircle;
      case "check-circle":
        return CheckCircle2;
      case "info":
        return Info;
      case "alert-triangle":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-card shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </Card>
    );
  }

  const hasData = notifications && notifications.length > 0;

  return (
    <Card className="border border-border/60 bg-card shadow-sm flex flex-col">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Notifikasi &amp; Pengumuman
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Update Terbaru Sistem
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-[#F54A00] hover:text-[#d64100] hover:bg-orange-500/10 gap-1">
            <Link href="/notifications">
              Lihat Semua
              <ExternalLink className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3 flex-1">
        {hasData ? (
          notifications.map((item) => {
            const IconComp = getIcon(item.iconName);
            return (
              <Link href={item.href ?? "/notifications"} key={item.id} aria-label={item.title}>
                <div
                  className={`p-3.5 rounded-xl border ${item.bgColor} flex items-center justify-between gap-3 cursor-pointer hover:opacity-90 transition-opacity group`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <IconComp className={`w-4 h-4 ${item.iconColor} shrink-0 mt-0.5`} />
                    <div className="space-y-0.5">
                      <p className={`text-xs font-semibold ${item.textColor}`}>{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-muted-foreground text-xs rounded-xl border border-dashed p-6">
            <span>Belum ada notifikasi atau aktivitas terbaru.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
