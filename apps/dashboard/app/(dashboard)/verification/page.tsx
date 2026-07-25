import { Metadata } from "next";
import { Suspense } from "react";
import { QCVerificationPageView } from "@/features/dashboard/components/views/qc-verification-page-view";
import { Skeleton } from "@repo/ui/skeleton";

export const metadata: Metadata = {
  title: "Verifikasi Dokumen - Quality Control",
  description: "Review dan verifikasi dokumen yang diunggah oleh Tim Uploader.",
};

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <QCVerificationPageView />
    </Suspense>
  );
}
