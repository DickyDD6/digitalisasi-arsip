"use client";

import React, { useState } from "react";
import { FileCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentItem } from "../../types/dashboard.types";

interface QCVerifyModalProps {
  doc: DocumentItem | null;
  onClose: () => void;
  onConfirm: (id: number, note?: string) => void;
  isVerifying: boolean;
}

export function QCVerifyModal({
  doc,
  onClose,
  onConfirm,
  isVerifying,
}: QCVerifyModalProps) {
  const [verifyNote, setVerifyNote] = useState("");

  const handleConfirm = () => {
    if (!doc) return;
    onConfirm(doc.id, verifyNote || undefined);
    setVerifyNote("");
  };

  const handleClose = () => {
    setVerifyNote("");
    onClose();
  };

  return (
    <Dialog open={!!doc} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[448px] p-0 overflow-hidden gap-0">
        {/* Header matching Figma Node 1714:17996 */}
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
            Verifikasi Dokumen
          </DialogTitle>
        </DialogHeader>

        {/* Content matching Figma Node 1714:18003 */}
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          {/* Round Green Icon Container */}
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#00C951] flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>

          {/* Question Text */}
          <div className="space-y-1 text-sm text-foreground">
            <p className="text-muted-foreground">Apakah Anda yakin dokumen</p>
            <p className="font-bold text-base text-foreground break-all px-2">
              {doc?.title || doc?.file_name || "Dokumen"}
            </p>
            <p className="text-muted-foreground">
              sudah sesuai standar dan layak diverifikasi?
            </p>
          </div>

          {/* Optional Note Textarea */}
          <div className="w-full text-left space-y-1.5 mt-1">
            <label className="text-xs font-medium text-foreground">
              Catatan Verifikasi (Opsional)
            </label>
            <Textarea
              placeholder="Tambahkan catatan jika diperlukan..."
              value={verifyNote}
              onChange={(e) => setVerifyNote(e.target.value)}
              className="min-h-[90px] text-xs border-border/70 focus-visible:ring-emerald-500"
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
            disabled={isVerifying}
            className="w-full text-xs font-medium h-10 bg-[#00C951] hover:bg-[#00a642] text-white shadow-xs"
          >
            {isVerifying ? "Memproses..." : "Ya, Verifikasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
