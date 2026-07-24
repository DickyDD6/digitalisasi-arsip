import React from "react";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";

export interface TimelineEvent {
  id: string;
  documentId: number;
  type: "upload" | "verified" | "rejected";
  title: string;
  timestamp: Date;
  timeStr: string;
  dateStr: string;
  fileName: string;
  documentType: string;
  description: string;
  verifierName?: string;
}

interface UploadHistoryTimelineItemProps {
  item: TimelineEvent;
  isLast: boolean;
}

export function UploadHistoryTimelineItem({
  item,
  isLast,
}: UploadHistoryTimelineItemProps) {
  const isVerified = item.type === "verified";
  const isRejected = item.type === "rejected";

  return (
    <div className="relative flex gap-4 items-start">
      {/* Vertical Connecting Line */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-border/60 -mb-6" />
      )}

      {/* Icon Badge */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
          isVerified
            ? "bg-[#DCFCE7] text-[#00A63E]"
            : isRejected
            ? "bg-[#FFE2E2] text-[#E7000B]"
            : "bg-[#FEF9C2] text-[#D08700]"
        }`}
      >
        {isVerified ? (
          <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
        ) : isRejected ? (
          <XCircle className="w-5 h-5 stroke-[2.2]" />
        ) : (
          <Clock className="w-5 h-5 stroke-[2.2]" />
        )}
      </div>

      {/* Details Box */}
      <div className="flex-1 pt-0.5 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-foreground">
            {item.title}
          </h4>
          <span className="text-xs text-muted-foreground font-normal">
            • {item.timeStr}
          </span>
        </div>

        {/* File Name */}
        <div className="flex items-center gap-2 pt-0.5">
          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-semibold text-foreground truncate max-w-md">
            {item.fileName}
          </span>
        </div>

        {/* Event Description / Rejection Reason Note */}
        <p
          className={`text-xs pt-0.5 leading-relaxed ${
            isRejected ? "text-[#E7000B] font-medium" : "text-muted-foreground"
          }`}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}
