import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

export function UploadHistoryHeaderBanner() {
  return (
    <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
      <CardHeader className="p-5 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Riwayat Upload
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Timeline lengkap aktivitas upload dan verifikasi dokumen Anda
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
