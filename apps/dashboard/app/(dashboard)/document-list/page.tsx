import { Metadata } from "next";
import { UploaderDocumentListView } from "@/features/documents/components/uploader-document-list-view";

export const metadata: Metadata = {
  title: "Daftar Dokumen Saya",
  description: "Kelola semua dokumen yang telah Anda upload",
};

export default function DocumentListPage() {
  return <UploaderDocumentListView />;
}
