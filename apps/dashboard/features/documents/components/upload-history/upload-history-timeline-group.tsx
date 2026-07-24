import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TimelineEvent,
  UploadHistoryTimelineItem,
} from "./upload-history-timeline-item";

interface UploadHistoryTimelineGroupProps {
  dateStr: string;
  items: TimelineEvent[];
}

export function UploadHistoryTimelineGroup({
  dateStr,
  items,
}: UploadHistoryTimelineGroupProps) {
  return (
    <Card className="border border-border/60 bg-card shadow-sm overflow-hidden p-0">
      {/* Date Group Header - Flush at top (pt-0) */}
      <div className="bg-muted/40 px-6 py-3.5 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-foreground/70" />
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            {dateStr}
          </h3>
        </div>
        <Badge
          variant="secondary"
          className="bg-background text-muted-foreground text-xs font-normal"
        >
          • {items.length} aktivitas
        </Badge>
      </div>

      {/* Group Events List */}
      <CardContent className="p-6 space-y-6">
        {items.map((item, index) => (
          <UploadHistoryTimelineItem
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}
