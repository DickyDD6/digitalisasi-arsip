import {
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/shared/components/page-header";
import { ReportContent } from "@/features/reports/components/report-content";

export default function ReportPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Laporan & Statistik</PageTitle>
        <PageDescription>
          Analisis data arsip, laporan penggunaan, dan statistik untuk mendukung
          pengambilan keputusan.
        </PageDescription>
      </PageHeader>

      <ReportContent />
    </>
  );
}
