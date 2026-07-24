"use client";

import React from "react";
import { FileSearch, Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DocumentTypeOption } from "./document-type-selector";

export interface MetadataFormState {
  prodi: string;
  tahun_ajaran: string;
  mata_kuliah: string;
  kelas: string;
  npm: string;
  tahun_lulus: string;
}

interface MetadataFormProps {
  documentType: DocumentTypeOption | null;
  file: File | null;
  formData: MetadataFormState;
  onChange: (field: keyof MetadataFormState, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const PRODI_OPTIONS = [
  "Teknik Informatika",
  "Teknologi Pangan",
  "Teknik Industri",
  "Teknik Mesin",
  "Teknik Lingkungan",
  "Perencanaan Wilayah dan Kota",
];

const TAHUN_AJARAN_OPTIONS = [
  "2025/2026",
  "2024/2025",
  "2023/2024",
  "2022/2023",
  "2021/2022",
  "2020/2021",
];

const KELAS_OPTIONS = ["A", "B", "C", "D", "NR"];

export function MetadataForm({
  documentType,
  file,
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
}: MetadataFormProps) {
  const isNilai = documentType === "nilai";

  return (
    <Card className="border border-border/60 bg-card shadow-sm h-full flex flex-col justify-between">
      <CardHeader className="p-5 border-b border-border/40">
        <CardTitle className="text-base font-semibold text-foreground">
          Lengkapi Metadata Dokumen
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col justify-between gap-6">
        {!documentType ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground my-auto">
            <FileSearch className="w-12 h-12 stroke-[1.5] text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium">Pilih jenis dokumen di sebelah kiri</p>
            <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">
              Formulir isian metadata akan muncul secara otomatis sesuai dengan tipe dokumen yang Anda pilih.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col justify-between h-full space-y-5">
            <div className="space-y-4">
              {/* Program Studi (All document types) */}
              <div className="space-y-1.5 w-full">
                <Label className="text-xs font-semibold text-foreground">
                  Program Studi <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.prodi}
                  onValueChange={(val) => onChange("prodi", val)}
                  required
                >
                  <SelectTrigger className="w-full h-10 text-xs">
                    <SelectValue placeholder="Pilih Program Studi" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODI_OPTIONS.map((prodi) => (
                      <SelectItem key={prodi} value={prodi} className="text-xs">
                        {prodi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional fields for 'Nilai' */}
              {isNilai ? (
                <>
                  {/* Tahun Ajaran */}
                  <div className="space-y-1.5 w-full">
                    <Label className="text-xs font-semibold text-foreground">
                      Tahun Ajaran <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.tahun_ajaran}
                      onValueChange={(val) => onChange("tahun_ajaran", val)}
                      required
                    >
                      <SelectTrigger className="w-full h-10 text-xs">
                        <SelectValue placeholder="Pilih Tahun Ajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {TAHUN_AJARAN_OPTIONS.map((ta) => (
                          <SelectItem key={ta} value={ta} className="text-xs">
                            {ta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mata Kuliah */}
                  <div className="space-y-1.5 w-full">
                    <Label className="text-xs font-semibold text-foreground">
                      Mata Kuliah <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Contoh: Pemrograman Web"
                      value={formData.mata_kuliah}
                      onChange={(e) => onChange("mata_kuliah", e.target.value)}
                      required
                      className="w-full h-10 text-xs"
                    />
                  </div>

                  {/* Kelas */}
                  <div className="space-y-1.5 w-full">
                    <Label className="text-xs font-semibold text-foreground">
                      Kelas <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.kelas}
                      onValueChange={(val) => onChange("kelas", val)}
                      required
                    >
                      <SelectTrigger className="w-full h-10 text-xs">
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {KELAS_OPTIONS.map((k) => (
                          <SelectItem key={k} value={k} className="text-xs">
                            Kelas {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                /* Conditional fields for 'Transkrip', 'Ijazah', and 'Berita Acara Sidang' */
                <>
                  {/* NPM */}
                  <div className="space-y-1.5 w-full">
                    <Label className="text-xs font-semibold text-foreground">
                      NPM <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Masukkan NPM Mahasiswa"
                      value={formData.npm}
                      onChange={(e) => onChange("npm", e.target.value)}
                      required
                      className="w-full h-10 text-xs"
                    />
                  </div>

                  {/* Tahun Lulus */}
                  <div className="space-y-1.5 w-full">
                    <Label className="text-xs font-semibold text-foreground">
                      Tahun Lulus <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Contoh: 2024"
                      value={formData.tahun_lulus}
                      onChange={(e) => onChange("tahun_lulus", e.target.value)}
                      required
                      className="w-full h-10 text-xs"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-border/40 w-full">
              <Button
                type="submit"
                disabled={!file || isSubmitting}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengunggah Dokumen...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Simpan & Unggah Dokumen
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
