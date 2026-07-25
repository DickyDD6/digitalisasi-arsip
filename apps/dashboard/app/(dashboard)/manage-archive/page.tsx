import {
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/shared/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { FileText } from "lucide-react";
import { Metadata } from "next";
import { ArchiveDataContent } from "@/features/archives/components/archive-data-content";

export const metadata: Metadata = {
  title: "Management Arsip - Manager",
  description:
    "Melihat, mengunduh, dan menghapus dokumen dan transkrip nilai siswa.",
};

const ManageArchivePage = () => {
  return (
    <>
      <PageHeader>
        <PageTitle>Management Arsip</PageTitle>
        <PageDescription>
          Melihat, mengunduh, dan menghapus dokumen dan transkrip nilai siswa.
        </PageDescription>
      </PageHeader>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <FileText className="text-primary size-4 md:size-6" /> Dokumen Arsip
            Digital
          </CardTitle>
          <CardDescription>
            Dokumen Nilai dan Transkrip Nilai Siswa (2000-2010)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full gap-5 px-0">
          <ArchiveDataContent />
        </CardContent>
      </Card>
    </>
  );
};

export default ManageArchivePage;
