"use client";

import React from "react";
import { CheckCircle2, XCircle, FileText, User, Calendar, Eye } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import type { DocumentItem } from "../../types/dashboard.types";
import {
  getDocCategory,
  getUploaderName,
  getFormattedDate,
} from "../../utils/document-mappers";

interface QCPendingDocumentItemProps {
  doc: DocumentItem;
  idx: number;
  isUrgent: boolean;
  onOpenVerify: (doc: DocumentItem) => void;
  onOpenReject: (doc: DocumentItem) => void;
  onOpenView?: (doc: DocumentItem) => void;
  isVerifying: boolean;
}

export function QCPendingDocumentItem({
  doc,
  isUrgent,
  onOpenVerify,
  onOpenReject,
  onOpenView,
  isVerifying,
}: QCPendingDocumentItemProps) {
  const docTitle = doc.title || doc.file_name || `Dokumen_${doc.id}`;
  const uploaderName = getUploaderName(doc);
  const uploadDate = getFormattedDate(doc.created_at);
  const categoryLabel = getDocCategory(doc);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-muted/40 transition-colors">
      {/* Left Info: Icon + Title + Uploader */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#FEF9C2] text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate hover:text-amber-600 transition-colors">
            {docTitle}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-muted-foreground/70" />
              <span>Diupload oleh {uploaderName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
              <span>{uploadDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Info: Badges & Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 shrink-0 self-end sm:self-center">
        <div className="flex items-center gap-1.5">
          {isUrgent && (
            <Badge
              variant="destructive"
              className="bg-[#FFE2E2] text-[#C10007] border-0 font-semibold text-xs py-0.5 px-2.5 rounded-full shadow-2xs"
            >
              Urgent
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground font-medium text-xs py-0.5 px-2.5 rounded-full"
          >
            {categoryLabel}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {onOpenView && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-medium gap-1 px-3 border-border/70"
              onClick={() => onOpenView(doc)}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat</span>
            </Button>
          )}

          <Button
            size="sm"
            className="h-8 bg-[#00A63E] hover:bg-[#008732] text-white font-medium text-xs gap-1.5 px-3.5 shadow-xs"
            onClick={() => onOpenVerify(doc)}
            disabled={isVerifying}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verifikasi</span>
          </Button>

          <Button
            size="sm"
            className="h-8 bg-[#E7000B] hover:bg-[#c10007] text-white font-medium text-xs gap-1.5 px-3 shadow-xs"
            onClick={() => onOpenReject(doc)}
            disabled={isVerifying}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Tolak</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
