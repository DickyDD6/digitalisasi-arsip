"use client";

import React, { useState } from "react";
import { FileX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { Textarea } from "@repo/ui/textarea";
import type { DocumentItem } from "../../types/dashboard.types";

interface QCRejectModalProps {
  doc: DocumentItem | null;
  onClose: () => void;
  onConfirm: (id: number, reason: string) => void;
  isVerifying: boolean;
}

export function QCRejectModal({
  doc,
  onClose,
  onConfirm,
  isVerifying,
}: QCRejectModalProps) {
  const [rejectReason, setRejectReason] = useState("");

  const handleConfirm = () => {
    if (!doc || !rejectReason.trim()) return;
    onConfirm(doc.id, rejectReason.trim());
    setRejectReason("");
  };

  const handleClose = () => {
    setRejectReason("");
    onClose();
  };

  return (
    <Dialog open={!!doc} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[448px] p-0 overflow-hidden gap-0">
        {/* Header matching Figma Node 1714:18674 */}
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
            Tolak Dokumen
          </DialogTitle>
        </DialogHeader>

        {/* Content matching Figma Node 1714:18681 */}
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          {/* Round Red Icon Container */}
          <div className="w-12 h-12 rounded-full bg-[#FFE2E2] text-[#E7000B] flex items-center justify-center shrink-0">
            <FileX className="w-6 h-6" />
          </div>

          {/* Question Text */}
          <div className="space-y-1 text-sm text-foreground">
            <p className="text-muted-foreground">
              Berikan alasan penolakan untuk dokumen
            </p>
            <p className="font-bold text-base text-foreground break-all px-2">
              {doc?.title || doc?.file_name || "Dokumen"}
            </p>
          </div>

          {/* Required Rejection Reason Textarea */}
          <div className="w-full text-left space-y-1.5 mt-1">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <span>Alasan Penolakan</span>
              <span className="text-[#E7000B] font-bold">*</span>
            </label>
            <Textarea
              placeholder="Jelaskan alasan penolakan secara detail..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[110px] text-xs border-border/70 focus-visible:ring-rose-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-6 pt-2 grid grid-cols-2 gap-3 sm:space-x-0">
          <Button
            variant="outline"
            size="default"
            onClick={handleClose}
            className="w-full text-xs font-medium h-10 border-border/70"
          >
            Batal
          </Button>
          <Button
            size="default"
            onClick={handleConfirm}
            disabled={isVerifying || !rejectReason.trim()}
            className="w-full text-xs font-medium h-10 bg-[#E7000B] hover:bg-[#c10007] text-white shadow-xs disabled:opacity-50"
          >
            {isVerifying ? "Memproses..." : "Tolak Dokumen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
