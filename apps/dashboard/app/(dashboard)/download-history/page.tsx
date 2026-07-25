"use client";

import React, { useState, useMemo } from "react";
import { PageDescription, PageHeader, PageTitle } from "@/shared/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Badge } from "@repo/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table";
import { Search, Download, History, CheckCircle2, RotateCcw, Calendar } from "lucide-react";
import { toast } from "sonner";

export interface DownloadLogItem {
  id: number;
  fileName: string;
  npm: string;
  prodi: string;
  downloadedAt: string;
  docId: number;
}

const DEFAULT_DOWNLOAD_LOGS: DownloadLogItem[] = [
  {
    id: 1,
    fileName: "Transkrip_Nilai_Formal_12345678.pdf",
    npm: "123456789",
    prodi: "Teknik Informatika",
    downloadedAt: "8 Jan 2026, 10:15",
    docId: 101,
  },
  {
    id: 2,
    fileName: "Berita_Acara_Sidang_AKADEMIK_2025.pdf",
    npm: "123456790",
    prodi: "Teknologi Pangan",
    downloadedAt: "8 Jan 2026, 09:40",
    docId: 102,
  },
  {
    id: 3,
    fileName: "Ijazah_Kelulusan_Fakultas_Teknik.pdf",
    npm: "123456791",
    prodi: "Teknik Industri",
    downloadedAt: "7 Jan 2026, 16:20",
    docId: 103,
  },
  {
    id: 4,
    fileName: "Transkrip_Semester_Ganjil_2025.pdf",
    npm: "123456792",
    prodi: "Teknik Lingkungan",
    downloadedAt: "7 Jan 2026, 14:10",
    docId: 104,
  },
  {
    id: 5,
    fileName: "Sertifikat_Akreditasi_Prodi_TI.pdf",
    npm: "123456793",
    prodi: "Teknik Informatika",
    downloadedAt: "6 Jan 2026, 11:30",
    docId: 105,
  },
  {
    id: 6,
    fileName: "Transkrip_Nilai_Mahasiswa_2024.pdf",
    npm: "123456794",
    prodi: "Teknik Mesin",
    downloadedAt: "5 Jan 2026, 15:45",
    docId: 106,
  },
  {
    id: 7,
    fileName: "Rekap_Nilai_PWK_2025.pdf",
    npm: "123456795",
    prodi: "Perencanaan Wilayah & Kota",
    downloadedAt: "5 Jan 2026, 13:20",
    docId: 107,
  },
];

export default function RiwayatDownloadPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [logs] = useState<DownloadLogItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_DOWNLOAD_LOGS;
    try {
      const saved = localStorage.getItem("digital_archive_sbap_downloads");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_DOWNLOAD_LOGS;
  });

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        const matchesFile = item.fileName.toLowerCase().includes(term);
        const matchesNpm = item.npm.toLowerCase().includes(term);
        const matchesProdi = item.prodi.toLowerCase().includes(term);
        if (!matchesFile && !matchesNpm && !matchesProdi) return false;
      }

      return true;
    });
  }, [logs, searchTerm]);

  const handleReDownload = (item: DownloadLogItem) => {
    toast.success(`Mengunduh ulang "${item.fileName}"`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <PageHeader>
        <PageTitle>Riwayat Unduhan Dokumen (SBAP)</PageTitle>
        <PageDescription>
          Catatan log aktivitas pengunduhan arsip digital terverifikasi yang dilakukan oleh Pegawai SBAP
        </PageDescription>
      </PageHeader>

      {/* Filter Card */}
      <Card className="border border-border/60 bg-card shadow-sm">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Filter Log Unduhan
            </CardTitle>
            {(searchTerm || startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filter
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Cari file, NPM, atau prodi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Tanggal Dari */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Tanggal Sampai */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Table Card */}
      <Card className="border border-border/60 bg-card shadow-sm">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Daftar Log Unduhan ({filteredLogs.length})
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Daftar lengkap arsip terverifikasi yang pernah Anda unduh
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          {filteredLogs.length > 0 ? (
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-foreground">Nama File Dokumen</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">NPM Mahasiswa</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Program Studi</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Waktu Unduh</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-xs text-foreground">
                        {item.fileName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.npm}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.prodi}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.downloadedAt}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 text-[10px] gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Terverifikasi
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReDownload(item)}
                          className="h-8 text-xs gap-1 text-[#F54A00] hover:text-[#d64100] hover:bg-orange-50 dark:hover:bg-orange-950/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Ulang
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-muted-foreground text-xs rounded-xl border border-dashed p-6">
              <span>Belum ada riwayat unduhan yang cocok dengan filter.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
