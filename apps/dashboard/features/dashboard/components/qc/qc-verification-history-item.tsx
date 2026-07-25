"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock, FileText, User, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DocumentItem } from "../../types/dashboard.types";
import {
  getDocCategory,
  getUploaderName,
  getVerifierName,
  getFormattedDate,
  getNormalizedStatus,
} from "../../utils/document-mappers";

interface QCVerificationHistoryItemProps {
  doc: DocumentItem;
  onOpenView?: (doc: DocumentItem) => void;
}

export function QCVerificationHistoryItem({
  doc,
  onOpenView,
}: QCVerificationHistoryItemProps) {
  const docTitle = doc.title || doc.file_name || `Dokumen_${doc.id}`;
  const uploaderName = getUploaderName(doc);
  const verifierName = getVerifierName(doc);
  const processedAt = getFormattedDate(doc.verified_at || doc.created_at);
  const categoryLabel = getDocCategory(doc);
  const normalizedStatus = getNormalizedStatus(doc);

  const noteText = doc.verification_note || "-";

  return (
    <div className="p-4 sm:p-5 hover:bg-muted/30 transition-colors flex flex-col gap-3">
      {/* Top Row: File Name, Uploader Info & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground truncate">{docTitle}</h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-muted-foreground/70" />
                <span>Diupload oleh {uploaderName}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                <span>Diverifikasi oleh {verifierName} pada {processedAt}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground font-medium text-xs rounded-full"
          >
            {categoryLabel}
          </Badge>

          {normalizedStatus === "verified" && (
            <Badge
              variant="secondary"
              className="bg-[#DCFCE7] text-[#008732] border-0 font-semibold text-xs py-0.5 px-3 rounded-full flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terverifikasi</span>
            </Badge>
          )}

          {normalizedStatus === "rejected" && (
            <Badge
              variant="destructive"
              className="bg-[#FFE2E2] text-[#C10007] border-0 font-semibold text-xs py-0.5 px-3 rounded-full flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Ditolak</span>
            </Badge>
          )}

          {normalizedStatus === "pending" && (
            <Badge
              variant="secondary"
              className="bg-[#FEF9C2] text-[#A65F00] dark:bg-amber-950 dark:text-amber-300 border-0 font-semibold text-xs py-0.5 px-3 rounded-full flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Menunggu Verifikasi</span>
            </Badge>
          )}

          {onOpenView && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenView(doc)}
              className="h-8 text-xs font-medium gap-1 px-2.5 border-border/70 ml-1"
            >
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Lihat</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Note Container if verification note exists */}
      {doc.verification_note && (
        <div className="p-3 rounded-lg bg-muted/40 text-xs text-foreground/90 border border-border/40">
          <span className="font-medium text-muted-foreground">Catatan Verifikasi: </span>
          <span>{noteText}</span>
        </div>
      )}
    </div>
  );
}
