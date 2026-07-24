import { Metadata } from "next";
import { UploadDocumentView } from "@/features/upload/components/upload-document-view";

export const metadata: Metadata = {
  title: "Upload Dokumen Arsip",
  description: "Unggah dokumen arsip akademik (Nilai, Transkrip, Ijazah)",
};

export default function UploadDocumentPage() {
  return <UploadDocumentView />;
}
