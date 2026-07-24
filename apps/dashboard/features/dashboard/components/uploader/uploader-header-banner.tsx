import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UploaderHeaderBanner() {
  return (
    <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
      <CardHeader className="p-5 sm:p-6">
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Dashboard Manajer Arsip Nilai
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Sistem Informasi Pengelolaan Arsip Dokumen Nilai dan Transkrip Mahasiswa Fakultas Teknik (2000-2010)
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
