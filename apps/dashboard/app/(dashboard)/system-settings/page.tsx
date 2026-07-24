"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Settings,
  Shield,
  Bell,
  HardDrive,
  FileCheck,
  Upload,
  Printer,
  Save,
  CheckCircle2,
} from "lucide-react";
import { authQueries } from "@/features/auth/queries/auth.queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SystemSettingPage() {
  const { data: user } = useQuery(authQueries.userMe());
  const role = user?.role || "manager";

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Pengaturan berhasil disimpan.");
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header Card */}
      <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
        <CardHeader className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Pengaturan Sistem
                </CardTitle>
                <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200">
                  {role.toUpperCase()}
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Konfigurasi preferensi sistem, notifikasi, dan parameter peran pengguna
              </CardDescription>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#F54A00] hover:bg-[#d64100] text-white shadow-sm font-medium gap-2 self-start md:self-auto"
            >
              {saving ? (
                <CheckCircle2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Pengaturan
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="role-settings" className="w-full">
        <TabsList className="bg-muted/60 p-1 rounded-xl">
          <TabsTrigger value="role-settings" className="text-xs font-medium gap-2">
            <Settings className="w-3.5 h-3.5" />
            Preferensi Peran ({role.toUpperCase()})
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs font-medium gap-2">
            <Bell className="w-3.5 h-3.5" />
            Notifikasi
          </TabsTrigger>
          {role === "manager" && (
            <TabsTrigger value="system" className="text-xs font-medium gap-2">
              <HardDrive className="w-3.5 h-3.5" />
              Sistem &amp; Backup
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab 1: Role-Specific Settings */}
        <TabsContent value="role-settings" className="mt-4 space-y-4">
          {role === "manager" && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold">Pengaturan Manajer Arsip</CardTitle>
                <CardDescription className="text-xs">
                  Kebijakan retensi dokumen, batas verifikasi, dan kontrol hak akses
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Batas Waktu Peringatan Verifikasi QC</p>
                    <p className="text-muted-foreground">Beri peringatan jika dokumen pending &gt; 3 hari</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">AKTIF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Retensi Arsip Digital</p>
                    <p className="text-muted-foreground">Simpan arsip aktif periode 2000-2010 secara permanen</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#F54A00]/10 text-[#F54A00]">PERMANEN</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {role === "qc" && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold">Pengaturan Quality Control (QC)</CardTitle>
                <CardDescription className="text-xs">
                  Parameter verifikasi dan penandaan otomatis kesalahan dokumen
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Pemeriksaan OCR Otomatis</p>
                    <p className="text-muted-foreground">Deteksi teks nama &amp; NPM otomatis saat verifikasi</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">AKTIF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Catatan Penolakan Wajib</p>
                    <p className="text-muted-foreground">Wajib mengisi alasan saat menolak dokumen uploader</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">AKTIF</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {role === "uploader" && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold">Pengaturan Uploader Dokumen</CardTitle>
                <CardDescription className="text-xs">
                  Format default unggahan dan kompresi file
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Kompresi PDF Otomatis</p>
                    <p className="text-muted-foreground">Optimalkan ukuran file PDF yang diunggah</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">AKTIF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Validasi Ekstensi File (PDF/PNG)</p>
                    <p className="text-muted-foreground">Batasi jenis file hanya PDF dan PNG</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">AKTIF</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {role === "sbap" && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold">Pengaturan Staff Biro Akademik (SBAP)</CardTitle>
                <CardDescription className="text-xs">
                  Format pengunduhan dan watermarking cetak transkrip
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Watermark Resmi FT Unpas</p>
                    <p className="text-muted-foreground">Cetak stempel watermark resmi pada unduhan dokumen</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">AKTIF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Format Default Unduhan Bulk</p>
                    <p className="text-muted-foreground">Kemasi multiple dokumen dalam format ZIP</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">ZIP FORMAT</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Notification Settings */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="p-5">
              <CardTitle className="text-base font-semibold">Pengaturan Notifikasi Sistem</CardTitle>
              <CardDescription className="text-xs">
                Kelola notifikasi yang tampil pada lonceng navbar
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-semibold text-foreground">Notifikasi Lonceng Navbar</p>
                  <p className="text-muted-foreground">Tampilkan indikator angka notifikasi belum dibaca</p>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">AKTIF</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-semibold text-foreground">Notifikasi Perubahan Status Dokumen</p>
                  <p className="text-muted-foreground">Terima info saat dokumen diverifikasi / ditolak</p>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">AKTIF</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: System & Backup (Manager Only) */}
        {role === "manager" && (
          <TabsContent value="system" className="mt-4">
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold">Manajemen Backup &amp; Log Sistem</CardTitle>
                <CardDescription className="text-xs">
                  Ekspor log audit dan konfigurasi server backend
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-semibold text-foreground">Export Log Audit CSV</p>
                    <p className="text-muted-foreground">Unduh log aktivitas sistem terbaru</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Ekspor Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
