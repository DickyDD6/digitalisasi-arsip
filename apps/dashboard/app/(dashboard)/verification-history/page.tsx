import { Metadata } from "next";
import { Suspense } from "react";
import { QCVerificationHistoryPageView } from "@/features/dashboard/components/views/qc-verification-history-page-view";
import { Skeleton } from "@repo/ui/skeleton";

export const metadata: Metadata = {
  title: "Riwayat Verifikasi Dokumen - Quality Control",
  description: "Daftar seluruh riwayat verifikasi dan penolakan dokumen yang telah diproses oleh Tim QC.",
};

export default function VerificationHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <QCVerificationHistoryPageView />
    </Suspense>
  );
}
