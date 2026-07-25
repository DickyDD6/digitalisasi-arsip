import React from "react";
import Link from "next/link";
import { Download, ExternalLink, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";

export interface DownloadLogItem {
  id: number;
  fileName: string;
  npm: string;
  prodi: string;
  downloadedAt: string;
  docId: number;
}

const DEFAULT_RECENT_DOWNLOADS: DownloadLogItem[] = [
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
];

interface SBAPRecentDownloadsCardProps {
  onDownload: (docId: number) => void;
}

export function SBAPRecentDownloadsCard({ onDownload }: SBAPRecentDownloadsCardProps) {
  const [downloads] = React.useState<DownloadLogItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_RECENT_DOWNLOADS;
    try {
      const saved = localStorage.getItem("digital_archive_sbap_downloads");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5);
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECENT_DOWNLOADS;
  });

  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">
            Riwayat Download Terbaru
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Dokumen yang baru saja Anda unduh
          </CardDescription>
        </div>
        <Button
          render={<Link href="/download-history" />}
          variant="outline"
          size="sm"
          className="text-xs h-8 gap-1.5 border-border/60"
        >
          Lihat Semua
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="divide-y divide-border/40 rounded-xl border border-border/60 overflow-hidden bg-card">
          {downloads.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {item.fileName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    NPM: {item.npm} • {item.prodi} • {item.downloadedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] gap-1 px-2.5 py-0.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Terverifikasi
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(item.docId)}
                  className="h-8 text-xs text-[#F54A00] hover:text-[#d64100] hover:bg-orange-50 dark:hover:bg-orange-950/20 font-medium gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Lagi
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
