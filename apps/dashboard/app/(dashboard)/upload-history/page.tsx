import { Metadata } from "next";
import { UploaderUploadHistoryView } from "@/features/documents/components/uploader-upload-history-view";

export const metadata: Metadata = {
  title: "Riwayat Upload",
  description: "Timeline lengkap aktivitas upload dan verifikasi dokumen Anda",
};

export default function UploadHistoryPage() {
  return <UploaderUploadHistoryView />;
}
