import React from "react";
import { Search, RefreshCw, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Badge } from "@repo/ui/badge";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import type { DocumentItem } from "../../types/dashboard.types";

interface SBAPVerifiedDocumentsTableProps {
  verifiedDocs: DocumentItem[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onDownload: (id: number) => void;
}

export function SBAPVerifiedDocumentsTable({
  verifiedDocs,
  isLoading,
  searchTerm,
  onSearchChange,
  onRefresh,
  onDownload,
}: SBAPVerifiedDocumentsTableProps) {
  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Daftar Arsip Siap Download / Cetak
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Dokumen resmi yang telah diverifikasi oleh tim QC
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Cari nama dokumen..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-1.5 text-xs h-9"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        {isLoading ? (
          <div className="space-y-3 pt-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : verifiedDocs.length > 0 ? (
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-xs text-foreground">Nama Dokumen</TableHead>
                  <TableHead className="font-semibold text-xs text-foreground">Status Verifikasi</TableHead>
                  <TableHead className="font-semibold text-xs text-foreground">Tanggal Diverifikasi</TableHead>
                  <TableHead className="font-semibold text-xs text-foreground text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifiedDocs.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-xs text-foreground">
                      {doc.title || doc.file_name || `Dokumen #${doc.id}`}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 text-[11px]"
                      >
                        VERIFIED
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1"
                          onClick={() => onDownload(doc.id)}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-muted-foreground text-xs rounded-xl border border-dashed p-6">
            <span>Belum ada dokumen terverifikasi yang cocok.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
