import React from "react";
import { Badge } from "@repo/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Building2 } from "lucide-react";

export function SBAPHeaderBanner() {
  return (
    <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
      <CardHeader className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Dashboard Pegawai SBAP
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground pt-1">
              Cari, lihat, dan unduh arsip digital yang telah terverifikasi
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-semibold px-3 py-1 text-xs">
              Staff Biro Akademik (SBAP)
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
