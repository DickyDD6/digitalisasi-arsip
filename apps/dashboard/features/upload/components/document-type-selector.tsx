"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

export type DocumentTypeOption =
  | "nilai"
  | "transkrip"
  | "ijazah"
  | "berita_acara_sidang";

interface DocumentTypeSelectorProps {
  selectedType: DocumentTypeOption | null;
  onSelect: (type: DocumentTypeOption) => void;
}

export function DocumentTypeSelector({
  selectedType,
  onSelect,
}: DocumentTypeSelectorProps) {
  const options: {
    id: DocumentTypeOption;
    title: string;
    description: string;
  }[] = [
    {
      id: "nilai",
      title: "Nilai Mata Kuliah",
      description: "Dokumen nilai mahasiswa per mata kuliah",
    },
    {
      id: "transkrip",
      title: "Transkrip (Formal/Sementara)",
      description: "Transkrip nilai mahasiswa",
    },
    {
      id: "ijazah",
      title: "Ijazah",
      description: "Dokumen ijazah kelulusan",
    },
    {
      id: "berita_acara_sidang",
      title: "Berita Acara Sidang",
      description: "Dokumen berita acara pelaksanaan sidang mahasiswa",
    },
  ];

  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
        <CardTitle className="text-base font-bold text-foreground">
          1. Pilih Jenis Dokumen
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-0 space-y-2.5">
        {options.map((option) => {
          const isSelected = selectedType === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`relative flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#FFF7ED] dark:bg-orange-950/20 border-[#F54A00] ring-1 ring-[#F54A00]/30 shadow-sm"
                  : "bg-card border-border/60 hover:border-border hover:bg-muted/30"
              }`}
            >
              {/* Radio Circle */}
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  isSelected
                    ? "border-[#F54A00] bg-[#F54A00]"
                    : "border-muted-foreground/40 bg-background"
                }`}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              {/* Label & Description */}
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                  {option.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
