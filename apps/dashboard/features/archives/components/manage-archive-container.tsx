"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { QCVerificationPageView } from "@/features/dashboard/components/views/qc-verification-page-view";
import { ArchiveDataContent } from "./archive-data-content";
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
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export function ManageArchiveContainer() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase();

  // If user is QC and accessing pending verification or standard archive page
  if (userRole === "qc" && (statusParam === "menunggu_verifikasi" || !statusParam)) {
    return <QCVerificationPageView />;
  }

  return (
    <>
      <PageHeader>
        <PageTitle>Management Arsip</PageTitle>
        <PageDescription>
          Melihat, mengunduh, dan mengelola dokumen dan transkrip nilai.
        </PageDescription>
      </PageHeader>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <FileText className="text-primary size-4 md:size-6" /> Dokumen Arsip Digital
          </CardTitle>
          <CardDescription>
            Dokumen Nilai dan Transkrip Nilai (2000-2010)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full gap-5 px-0">
          <ArchiveDataContent />
        </CardContent>
      </Card>
    </>
  );
}
