import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SBAPHeaderBanner() {
  return (
    <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
      <CardHeader className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Dashboard Staff Biro Akademik (SBAP)
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Pencarian, pengunduhan arsip digital terverifikasi, dan pencetakan dokumen transkrip
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 font-medium">
              SBAP Role
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
