"use client";

import { documentListService } from "../services/document-list.service";
import { downloadFile } from "@/shared/utils/download-helper";
import { toast } from "sonner";

export function useDocumentDownload() {
  const handleDownload = async (doc: ArchiveDocument) => {
    try {
      toast.info("Sedang mengunduh dokumen...", { id: `download-${doc.id}` });
      const blob = await documentListService.downloadDocument(doc.id);
      downloadFile(blob, doc.file_name || `dokumen-${doc.id}.pdf`);
      toast.success("Dokumen berhasil diunduh!", { id: `download-${doc.id}` });
    } catch {
      toast.error("Gagal mengunduh dokumen", {
        id: `download-${doc.id}`,
        description:
          "File tidak ditemukan di server atau Anda tidak memiliki izin akses.",
      });
    }
  };

  return { handleDownload };
}
