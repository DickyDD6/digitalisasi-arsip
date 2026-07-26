"use client";

import React from "react";
import {
  FileX,
  XCircle,
  User,
  Calendar,
  HardDrive,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import type { DocumentItem } from "../../types/dashboard.types";
import {
  getDocCategory,
  getUploaderName,
  getFileSizeFormatted,
  getFormattedDate,
} from "../../utils/document-mappers";

interface QCRejectedDocumentItemProps {
  doc: DocumentItem;
  onOpenView?: (doc: DocumentItem) => void;
}

export function QCRejectedDocumentItem({
  doc,
  onOpenView,
}: QCRejectedDocumentItemProps) {
  const docTitle = doc.title || doc.file_name || `Dokumen_${doc.id}`;
  const uploaderName = getUploaderName(doc);
  const rejectedDate = getFormattedDate(doc.created_at);
  const fileSize = getFileSizeFormatted(doc);
  const docCategory = getDocCategory(doc);

  const rejectionNote = doc.verification_note || "-";

  // Real API fields strictly without dummy string generators
  const prodi = doc.prodi || doc.department || "-";
  const academicYear = doc.tahun_ajaran || doc.academic_year || "-";
  const semester = doc.semester || "-";
  const courseName = doc.mata_kuliah || doc.course_name || "-";
  const kelas = doc.kelas || doc.class_name || "-";
  const npm = doc.npm || doc.student_number || "-";
  const studentName = doc.student_name || "-";
  const graduationYear = doc.tahun_lulus || doc.graduation_year || "-";

  return (
    <Card className="border border-border/60 bg-card shadow-xs overflow-hidden transition-all hover:shadow-md">
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Row: Red Icon, Title & Rejected Badge */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Red Icon Circle Container */}
            <div className="w-12 h-12 rounded-xl bg-[#FFE2E2] text-[#E7000B] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <FileX className="w-6 h-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="text-base font-bold text-foreground truncate hover:text-rose-600 transition-colors">
                {docTitle}
              </h3>

              {/* Sub-info */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <User className="w-3.5 h-3.5 text-muted-foreground/70" />
                  <span>Diupload oleh {uploaderName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                  <span>Ditolak pada {rejectedDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-muted-foreground/70" />
                  <span>{fileSize}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="destructive"
              className="bg-[#FFE2E2] text-[#C10007] border-0 font-semibold text-xs py-0.5 px-3 rounded-full shadow-2xs flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Ditolak</span>
            </Badge>

            <Badge
              variant="outline"
              className="bg-muted/60 text-foreground font-medium text-xs py-0.5 px-3 rounded-full border-border/60"
            >
              {docCategory}
            </Badge>
          </div>
        </div>

        {/* Rejection Reason Red Alert Box */}
        {doc.verification_note && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-rose-700 dark:text-rose-300">
                Alasan Penolakan:{" "}
              </span>
              <p className="leading-relaxed">{rejectionNote}</p>
            </div>
          </div>
        )}

        {/* Gray Metadata Grid Container */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-xs">
          {docCategory === "Nilai" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  PRODI
                </span>
                <p className="font-semibold text-foreground mt-0.5 truncate">
                  {prodi}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  TAHUN AJARAN
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  {academicYear}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  SEMESTER
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  {semester}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  MATA KULIAH
                </span>
                <p className="font-semibold text-foreground mt-0.5 truncate">
                  {courseName}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  KELAS
                </span>
                <p className="font-semibold text-foreground mt-0.5">{kelas}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  NPM
                </span>
                <p className="font-semibold text-foreground mt-0.5">{npm}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  NAMA MAHASISWA
                </span>
                <p className="font-semibold text-foreground mt-0.5 truncate">
                  {studentName}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  PRODI
                </span>
                <p className="font-semibold text-foreground mt-0.5 truncate">
                  {prodi}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  TAHUN LULUS
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  {graduationYear}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        {onOpenView && (
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/40">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenView(doc)}
              className="h-9 border-border/70 text-xs font-medium gap-1.5 px-3.5"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span>Lihat Dokumen</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
