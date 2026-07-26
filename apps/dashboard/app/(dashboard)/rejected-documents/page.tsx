import { Metadata } from "next";
import { Suspense } from "react";
import { QCRejectedDocumentsPageView } from "@/features/dashboard/components/views/qc-rejected-documents-page-view";
import { Skeleton } from "@repo/ui/skeleton";

export const metadata: Metadata = {
  title: "Dokumen Ditolak - Quality Control",
  description:
    "Daftar seluruh dokumen yang ditolak beserta catatan dan alasan penolakan dari Tim Quality Control.",
};

export default function RejectedDocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <QCRejectedDocumentsPageView />
    </Suspense>
  );
}
