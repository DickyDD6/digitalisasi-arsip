"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { http } from "@/shared/lib/http";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  FileX,
  Loader2,
  UserRound,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { Dispatch, useState } from "react";
import { Document, Page } from "@/shared/lib/react-pdf";
import {
  ARCHIVE_DOCUMENT_STATUS,
  ARCHIVE_DOCUMENT_TYPE,
} from "@/features/archives/constants/archive-document";

export const ViewArchiveModal = ({
  id,
  open,
  onOpenChange,
}: {
  id: number;
  open?: boolean;
  onOpenChange?: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(0.8);

  const { data } = useQuery({
    queryKey: ["archive-detail", id, open],
    queryFn: async () => {
      const { data } = await http.get<ApiResponse<ArchiveDocument>>(
        `/api/documents/${id}`,
      );
      return data;
    },
    enabled: !!id && open,
  });

  const { data: pdfBlob, isLoading: isPdfLoading } = useQuery({
    queryKey: ["pdf-preview", id, open],
    queryFn: async () => {
      const response = await http.get(`/api/documents/${id}/view`, {
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    },
    enabled: !!id && !!data?.data?.file_name && open,
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) =>
      Math.min(Math.max(1, prevPageNumber + offset), numPages),
    );
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button variant="ghost" className="justify-start">
          <Eye /> Lihat Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-row gap-4 px-6 pt-6 pb-4 shrink-0">
          <FileText className="size-10 md:size-12" />
          <div className="grid gap-2">
            <DialogTitle>
              {data?.data?.file_name || "Detail Dokumen"}
            </DialogTitle>
            <DialogDescription className="space-x-2">
              <Badge variant="secondary">
                {
                  ARCHIVE_DOCUMENT_TYPE[
                    data?.data?.document_type as ArchiveDocumentTypeKey
                  ]
                }
              </Badge>
              <Badge variant="default">
                {
                  ARCHIVE_DOCUMENT_STATUS[
                    data?.data?.status as ArchiveDocumentStatusKey
                  ]
                }
              </Badge>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6 overflow-x-hidden h-[calc(90vh-140px)]">
          <FieldSet>
            <FieldGroup>
              <Field orientation={"horizontal"}>
                <FileText className="size-4" />
                <FieldLabel>Metadata Dokumen</FieldLabel>
              </Field>
              <Field
                orientation={"horizontal"}
                className="justify-between border-b"
              >
                <span className="font-sm text-muted-foreground">Nama File</span>
                <span className="font-medium">
                  {data?.data?.file_name || "-"}
                </span>
              </Field>
              <Field
                orientation={"horizontal"}
                className="justify-between border-b"
              >
                <span className="font-sm text-muted-foreground">
                  Program Studi
                </span>
                <span className="font-medium">
                  {data?.data?.mata_kuliah || "-"}
                </span>
              </Field>
              <Field
                orientation={"horizontal"}
                className="justify-between border-b"
              >
                <span className="font-sm text-muted-foreground">
                  Tahun Lulus
                </span>
                <span className="font-medium">
                  {data?.data?.tahun_lulus || "-"}
                </span>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field orientation={"horizontal"}>
                <UserRound className="size-4" />
                <FieldLabel>Informasi Pengunggahan</FieldLabel>
              </Field>
              <Field
                orientation={"horizontal"}
                className="justify-between border-b"
              >
                <span className="font-sm text-muted-foreground">
                  Diunggah oleh
                </span>
                <span className="font-medium">
                  {data?.data?.uploaded_by_name || "-"}
                </span>
              </Field>
              <Field
                orientation={"horizontal"}
                className="justify-between border-b"
              >
                <span className="font-sm text-muted-foreground">
                  Tanggal Unggah
                </span>
                <span className="font-medium">
                  {data?.data?.updated_at
                    ? formatDate(new Date(data.data.updated_at), "dd/MM/yyyy")
                    : "-"}
                </span>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field orientation={"horizontal"}>
                <CheckCircle className="size-4" />
                <FieldLabel>Informasi Verifikasi</FieldLabel>
              </Field>
              <Field
                orientation={"horizontal"}
                className="justify-between border-b"
              >
                <span className="font-sm text-muted-foreground">
                  Diverifikasi oleh
                </span>
                <span className="font-medium">
                  {data?.data?.verified_by_name || "-"}
                </span>
              </Field>
              <Field
                orientation={"horizontal"}
                className="justify-between border-b"
              >
                <span className="font-sm text-muted-foreground">
                  Tanggal Verifikasi
                </span>
                <span className="font-medium">
                  {data?.data?.verified_at
                    ? formatDate(new Date(data.data.verified_at), "dd/MM/yyyy")
                    : "-"}
                </span>
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex flex-col h-full">
            <Field orientation={"horizontal"} className="mb-2">
              <FileText className="size-4" />
              <FieldLabel>Pratinjau Dokumen</FieldLabel>
            </Field>

            <div className="flex-1 flex flex-col bg-muted rounded-lg overflow-hidden">
              {isPdfLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="size-8 animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground">Memuat PDF...</p>
                </div>
              ) : pdfBlob ? (
                <>
                  {/* PDF Controls */}
                  <div className="flex items-center justify-between p-2 bg-background border-b shrink-0">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={previousPage}
                        disabled={pageNumber <= 1}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <span className="text-sm whitespace-nowrap">
                        Hal {pageNumber}/{numPages}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={nextPage}
                        disabled={pageNumber >= numPages}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                      >
                        <ZoomOut className="size-4" />
                      </Button>
                      <span className="text-sm whitespace-nowrap">
                        {Math.round(scale * 100)}%
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={zoomIn}
                        disabled={scale >= 2.0}
                      >
                        <ZoomIn className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
                    <div className="p-4 flex justify-center items-start min-h-full">
                      <Document
                        file={pdfBlob}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                          <div className="flex items-center justify-center p-8">
                            <Loader2 className="size-8 animate-spin" />
                          </div>
                        }
                        error={
                          <div className="flex flex-col items-center justify-center text-destructive p-8">
                            <FileX className="size-12 mb-2" />
                            <p className="text-sm">Gagal memuat PDF</p>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          scale={scale}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          className="shadow-lg bg-white"
                        />
                      </Document>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <FileX className="size-12 mb-4" />
                  <p className="text-sm">Pratinjau tidak tersedia</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
