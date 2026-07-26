import React from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { Download, Eye, FileText } from "lucide-react";
import {
  resolveDocumentStatus,
  DOCUMENT_STATUS_LABEL,
  DOCUMENT_STATUS_BADGE_CLASS,
} from "../../types/document-status";

interface DocumentListTableProps {
  documents: ArchiveDocument[];
  isLoading: boolean;
  onView: (id: number) => void;
  onDownload: (doc: ArchiveDocument) => void;
}

export function DocumentListTable({
  documents,
  isLoading,
  onView,
  onDownload,
}: DocumentListTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center text-muted-foreground text-xs rounded-xl border border-dashed p-6">
        <span>Tidak ada dokumen yang ditemukan.</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-xs text-foreground">
              Nama Dokumen
            </TableHead>
            <TableHead className="font-semibold text-xs text-foreground">
              Jenis
            </TableHead>
            <TableHead className="font-semibold text-xs text-foreground">
              Ukuran
            </TableHead>
            <TableHead className="font-semibold text-xs text-foreground">
              Tanggal Upload
            </TableHead>
            <TableHead className="font-semibold text-xs text-foreground">
              Status
            </TableHead>
            <TableHead className="font-semibold text-xs text-foreground text-right">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => {
            const status = resolveDocumentStatus(doc.status);
            return (
              <TableRow
                key={doc.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-xs text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] text-[#155DFC] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="truncate max-w-[220px]">
                      {doc.file_name || `Dokumen #${doc.id}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground text-[11px] rounded-full px-2.5"
                  >
                    {doc.document_type || "Dokumen"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {doc.file_size_formatted || "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(doc.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${DOCUMENT_STATUS_BADGE_CLASS[status]} text-[11px] rounded-full px-2.5`}
                  >
                    {DOCUMENT_STATUS_LABEL[status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(doc.id)}
                      title="Lihat Detail"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownload(doc)}
                      title="Unduh Dokumen"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
