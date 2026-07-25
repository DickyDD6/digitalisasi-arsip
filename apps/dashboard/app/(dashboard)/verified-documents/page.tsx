import { Metadata } from "next";
import { Suspense } from "react";
import { QCVerifiedDocumentsPageView } from "@/features/dashboard/components/views/qc-verified-documents-page-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Dokumen Terverifikasi - Quality Control",
  description: "Daftar seluruh arsip dokumen yang telah memenuhi standar Quality Control dan terverifikasi.",
};

export default function VerifiedDocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <QCVerifiedDocumentsPageView />
    </Suspense>
  );
}
