"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Printer } from "lucide-react";
import { reportService, GenerateReportPayload } from "../services/report.service";
import { toast } from "sonner";

interface GenerateReportDialogProps {
  reportTitle: string;
  defaultContent?: string[];
  trigger?: React.ReactNode;
}

export const GenerateReportDialog: React.FC<GenerateReportDialogProps> = ({
  reportTitle,
  defaultContent = ["upload_stats", "doc_status"],
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(today);
  const [format, setFormat] = useState<"pdf" | "xlsx" | "csv">("pdf");
  const [type, setType] = useState<"monthly" | "annual" | "custom">("monthly");
  const [style, setStyle] = useState<"detailed" | "summary" | "executive">("summary");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const payload: GenerateReportPayload = {
        period_start: startDate,
        period_end: endDate,
        format,
        type,
        style,
        content: defaultContent,
      };

      const filename = `${reportTitle.toLowerCase().replace(/\s+/g, "_")}_${startDate}_${endDate}.${format}`;
      await reportService.generate(payload, filename);
      toast.success("Laporan berhasil di-generate dan di-download!");
      setOpen(false);
    } catch (err: any) {
      toast.error("Gagal membuat laporan", {
        description: err?.response?.data?.message || "Terjadi kesalahan saat membuat laporan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="mt-4">
            <Printer className="size-4 mr-2" />
            Cetak Laporan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cetak {reportTitle}</DialogTitle>
          <DialogDescription>
            Pilih periode dan format file laporan yang ingin Anda unduh.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipe
            </Label>
            <div className="col-span-3">
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="annual">Tahunan</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Format
            </Label>
            <div className="col-span-3">
              <Select value={format} onValueChange={(val: any) => setFormat(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                  <SelectItem value="xlsx">Excel Document (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV File (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="style" className="text-right">
              Gaya
            </Label>
            <div className="col-span-3">
              <Select value={style} onValueChange={(val: any) => setStyle(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih gaya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Ringkasan (Summary)</SelectItem>
                  <SelectItem value="detailed">Detail (Detailed)</SelectItem>
                  <SelectItem value="executive">Eksekutif (Executive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_date" className="text-right">
              Mulai
            </Label>
            <Input
              id="start_date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_date" className="text-right">
              Selesai
            </Label>
            <Input
              id="end_date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              <>
                <Printer className="size-4 mr-2" />
                Unduh Laporan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
