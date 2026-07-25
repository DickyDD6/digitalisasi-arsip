"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { Card } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { uploadHistoryQueries } from "@/features/documents/queries/upload-history.queries";
import { UploadHistoryHeaderBanner } from "./upload-history/upload-history-header-banner";
import { UploadHistorySummaryMetrics } from "./upload-history/upload-history-summary-metrics";
import { UploadHistoryFilters } from "./upload-history/upload-history-filters";
import { UploadHistoryTimelineGroup } from "./upload-history/upload-history-timeline-group";
import { TimelineEvent } from "./upload-history/upload-history-timeline-item";

export function UploaderUploadHistoryView() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  const statsQuery = useQuery(uploadHistoryQueries.stats());
  const stats = statsQuery.data?.data;

  const historyQuery = useQuery(uploadHistoryQueries.list());
  const documents = historyQuery.data?.data || [];

  const timelineGroups = useMemo(() => {
    const events: TimelineEvent[] = [];

    documents.forEach((doc) => {
      const createdAt = new Date(doc.created_at);
      const statusStr = String(doc.status).toLowerCase();

      const isVerified = statusStr.includes("terverifikasi") && !statusStr.includes("tidak");
      const isRejected = statusStr.includes("tidak") || statusStr.includes("rejected") || statusStr.includes("ditolak");
      const isPending = !isVerified && !isRejected;

      if (selectedStatus === "all" || (selectedStatus === "menunggu_verifikasi" && isPending)) {
        events.push({
          id: `upload-${doc.id}`,
          documentId: doc.id,
          type: "upload",
          title: "Upload Dokumen",
          timestamp: createdAt,
          timeStr: createdAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dateStr: createdAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          fileName: doc.file_name || `Dokumen #${doc.id}`,
          documentType: doc.document_type || "Dokumen",
          description: "Dokumen berhasil diupload dan menunggu verifikasi",
        });
      }

      if ((selectedStatus === "all" || selectedStatus === "terverifikasi") && isVerified) {
        const verifiedAt = doc.verified_at ? new Date(doc.verified_at) : createdAt;

        events.push({
          id: `verify-${doc.id}`,
          documentId: doc.id,
          type: "verified",
          title: "Dokumen Terverifikasi",
          timestamp: verifiedAt,
          timeStr: verifiedAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dateStr: verifiedAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          fileName: doc.file_name || `Dokumen #${doc.id}`,
          documentType: doc.document_type || "Dokumen",
          description: `Dokumen telah diverifikasi oleh QC Team${doc.verified_by_name ? ` - ${doc.verified_by_name}` : ""}`,
          verifierName: doc.verified_by_name,
        });
      }

      if ((selectedStatus === "all" || selectedStatus === "tidak_terverifikasi") && isRejected) {
        const verifiedAt = doc.verified_at ? new Date(doc.verified_at) : createdAt;

        events.push({
          id: `reject-${doc.id}`,
          documentId: doc.id,
          type: "rejected",
          title: "Dokumen Ditolak",
          timestamp: verifiedAt,
          timeStr: verifiedAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dateStr: verifiedAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          fileName: doc.file_name || `Dokumen #${doc.id}`,
          documentType: doc.document_type || "Dokumen",
          description: doc.verification_note || "Format file atau metadata tidak sesuai standar",
        });
      }
    });

    let filteredEvents = events;
    if (selectedPeriod !== "all") {
      const now = new Date();
      if (selectedPeriod === "7d") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredEvents = events.filter((e) => e.timestamp >= sevenDaysAgo);
      } else if (selectedPeriod === "30d") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredEvents = events.filter((e) => e.timestamp >= thirtyDaysAgo);
      }
    }

    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const groups: { dateStr: string; items: TimelineEvent[] }[] = [];
    filteredEvents.forEach((event) => {
      const existingGroup = groups.find((g) => g.dateStr === event.dateStr);
      if (existingGroup) {
        existingGroup.items.push(event);
      } else {
        groups.push({ dateStr: event.dateStr, items: [event] });
      }
    });

    return groups;
  }, [documents, selectedStatus, selectedPeriod]);

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* 1. Header Banner */}
      <UploadHistoryHeaderBanner />

      {/* 2. Summary Metrics */}
      <UploadHistorySummaryMetrics
        isLoading={statsQuery.isLoading}
        stats={stats}
      />

      {/* 3. Filter Bar */}
      <UploadHistoryFilters
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* 4. Timeline Groups */}
      {historyQuery.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : timelineGroups.length > 0 ? (
        <div className="space-y-6">
          {timelineGroups.map((group) => (
            <UploadHistoryTimelineGroup
              key={group.dateStr}
              dateStr={group.dateStr}
              items={group.items}
            />
          ))}
        </div>
      ) : (
        <Card className="border border-border/60 bg-card p-12 text-center text-muted-foreground space-y-2">
          <Clock className="w-10 h-10 stroke-[1.5] text-muted-foreground/50 mx-auto" />
          <p className="text-sm font-medium">Belum ada riwayat aktivitas upload</p>
          <p className="text-xs text-muted-foreground/70">
            Aktivitas upload dan status verifikasi dokumen Anda akan muncul secara kronologis di sini.
          </p>
        </Card>
      )}
    </div>
  );
}
