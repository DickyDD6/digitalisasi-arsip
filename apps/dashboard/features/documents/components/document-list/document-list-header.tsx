import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DocumentListHeader() {
  return (
    <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
      <CardHeader className="p-5 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Daftar Dokumen Saya
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Kelola semua dokumen yang telah Anda upload
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
