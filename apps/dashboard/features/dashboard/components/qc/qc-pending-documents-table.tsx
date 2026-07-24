import React from "react";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DocumentItem } from "../../types/dashboard.types";

interface QCPendingDocumentsTableProps {
  pendingDocs: DocumentItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onVerify: (args: { id: number; status: "verified" | "rejected" }) => void;
  isVerifying: boolean;
}

export function QCPendingDocumentsTable({
  pendingDocs,
  isLoading,
  onRefresh,
  onVerify,
  isVerifying,
}: QCPendingDocumentsTableProps) {
  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Antrean Dokumen Menunggu Verifikasi
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Pilih dokumen untuk diverifikasi atau ditolak
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        {isLoading ? (
          <div className="space-y-3 pt-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : pendingDocs.length > 0 ? (
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-xs text-foreground">Nama Dokumen</TableHead>
                  <TableHead className="font-semibold text-xs text-foreground">Uploader</TableHead>
                  <TableHead className="font-semibold text-xs text-foreground">Tanggal Unggah</TableHead>
                  <TableHead className="font-semibold text-xs text-foreground text-right">Aksi Verifikasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDocs.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-xs text-foreground">
                      {doc.title || doc.file_name || `Dokumen #${doc.id}`}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {doc.uploader?.name || "Tim Uploader"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => onVerify({ id: doc.id, status: "verified" })}
                          disabled={isVerifying}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verifikasi
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1 border-rose-500 text-rose-600 hover:bg-rose-50"
                          onClick={() => onVerify({ id: doc.id, status: "rejected" })}
                          disabled={isVerifying}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Tolak
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
            <span>Tidak ada dokumen yang menunggu verifikasi saat ini.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
