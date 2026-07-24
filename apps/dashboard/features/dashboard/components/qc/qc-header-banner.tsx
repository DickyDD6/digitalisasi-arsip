import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function QCHeaderBanner() {
  return (
    <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
      <CardHeader className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Dashboard Tim Quality Control
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Verifikasi dan validasi dokumen yang diunggah oleh Tim Uploader
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
              QC Active Role
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
