"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { http } from "@/lib/http";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocumentTypeSelector, DocumentTypeOption } from "./document-type-selector";
import { FileDropzone } from "./file-dropzone";
import { MetadataForm, MetadataFormState } from "./metadata-form";

export function UploadDocumentView() {
  const router = useRouter();

  const [documentType, setDocumentType] = useState<DocumentTypeOption | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<MetadataFormState>({
    prodi: "",
    tahun_ajaran: "",
    mata_kuliah: "",
    kelas: "",
    npm: "",
    tahun_lulus: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: keyof MetadataFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: DocumentTypeOption) => {
    setDocumentType(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentType || !file) {
      toast.error("Format tidak lengkap", {
        description: "Pilih jenis dokumen dan unggah file PDF terlebih dahulu.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("file", file);
      payload.append("document_type", documentType);
      payload.append("prodi", formData.prodi);

      if (documentType === "nilai") {
        payload.append("tahun_ajaran", formData.tahun_ajaran);
        payload.append("mata_kuliah", formData.mata_kuliah);
        payload.append("kelas", formData.kelas);
      } else {
        payload.append("npm", formData.npm);
        payload.append("tahun_lulus", formData.tahun_lulus);
      }

      await http.post("/api/documents", payload);

      toast.success("Dokumen Berhasil Diunggah!", {
        description: "Dokumen sekarang sedang dalam antrean verifikasi QC.",
      });

      router.push("/document-list");
    } catch (err) {
      if (isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          "Gagal mengunggah dokumen. Silakan periksa kembali metadata input Anda.";
        toast.error("Gagal Mengunggah", {
          description: message,
        });
      } else {
        toast.error("Gagal Mengunggah", {
          description: "Terjadi kesalahan koneksi. Silakan coba lagi.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <Card className="border border-border/60 bg-card/90 shadow-sm backdrop-blur">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Upload Dokumen
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Unggah dokumen arsip akademik (Nilai, Transkrip Formal/Sementara, Ijazah, Berita Acara Sidang) dan lengkapi metadata yang diperlukan
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col gap-6 w-full">
          <DocumentTypeSelector
            selectedType={documentType}
            onSelect={handleTypeSelect}
          />
          <FileDropzone
            selectedFile={file}
            onFileSelect={setFile}
          />
        </div>

        <div className="flex flex-col w-full">
          <MetadataForm
            documentType={documentType}
            file={file}
            formData={formData}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
