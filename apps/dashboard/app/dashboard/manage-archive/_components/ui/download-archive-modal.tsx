"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadFile } from "@/lib/download-helper";
import { http } from "@/lib/http";
import { DocumentArchive } from "@/types/document";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { Download, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const DownloadArchiveModal = ({ id }: { id: number | number[] }) => {
  const { data: multipleQuery } = useQuery({
    queryKey: ["archive-detail-multiple", id],
    queryFn: async () => {
      const responses = await Promise.all(
        (id as number[]).map(async (singleId) =>
          http.get<ApiResponse<DocumentArchive>>(`/api/documents/${singleId}`),
        ),
      );
      return responses.map((res) => res.data);
    },
    enabled: Array.isArray(id) && id.length > 0,
    select: (data) =>
      data.map((item) => ({
        id: item.data.id,
        file_name: item.data.file_name,
        mata_kuliah: item.data.mata_kuliah,
        tahun_ajaran: item.data.tahun_ajaran,
      })),
  });

  const { data: singleQuery } = useQuery({
    queryKey: ["archive-detail", id],
    queryFn: async () => {
      const { data } = await http.get<ApiResponse<DocumentArchive>>(
        `/api/documents/${id}`,
      );
      return data;
    },
    enabled: !Array.isArray(id) && !!id,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const dataTableDetail = useReactTable({
    data: multipleQuery || [],
    columns: [
      {
        accessorKey: "file_name",
        header: "Nama File",
      },
      {
        accessorKey: "mata_kuliah",
        header: "Mata Kuliah",
      },
      {
        accessorKey: "tahun_ajaran",
        header: "Tahun Ajaran",
      },
    ] as ColumnDef<{
      id: number;
      file_name: string;
      mata_kuliah: string;
      tahun_ajaran: string;
    }>[],
    defaultColumn: {
      cell: ({ getValue }) => {
        const value = getValue();
        return typeof value === "string" ? value : "-";
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (Array.isArray(id)) {
        const response = await http.post(
          "/api/documents/download-multiple",
          {
            ids: id,
          },
          {
            responseType: "blob",
          },
        );

        const fileName = `documents_${new Date().getTime()}.zip`;

        return [{ blob: response.data, fileName }];
      } else {
        const response = await http.get(`/api/documents/${id}/download`, {
          responseType: "blob",
        });

        const fileName = singleQuery?.data?.file_name || `document-${id}.pdf`;

        return [{ blob: response.data, fileName }];
      }
    },
    onSuccess: (downloads) => {
      downloads?.forEach(({ blob, fileName }) => {
        downloadFile(blob, fileName);

        toast.success(`Arsip dengan nama file ${fileName} berhasil diunduh`, {
          description: `Periksa folder unduhan Anda untuk file dengan nama ${fileName}.`,
        });
      });

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    },
    onError: (error) => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 404:
            toast.error("Arsip tidak ditemukan", {
              description:
                "Arsip yang ingin diunduh tidak ditemukan atau mungkin sudah dihapus.",
              onAutoClose: () =>
                toast.info(
                  "Hubungi administrator untuk bantuan lebih lanjut.",
                  {
                    description:
                      "Jika Anda yakin arsip tersebut seharusnya ada, mungkin ada masalah dengan sistem. Hubungi administrator untuk mendapatkan bantuan.",
                  },
                ),
              onDismiss: () =>
                toast.info(
                  "Hubungi administrator untuk bantuan lebih lanjut.",
                  {
                    description:
                      "Jika Anda yakin arsip tersebut seharusnya ada, mungkin ada masalah dengan sistem. Hubungi administrator untuk mendapatkan bantuan.",
                  },
                ),
            });
            return;
          case 403:
            toast.error("Gagal mengunduh arsip", {
              description:
                "Anda tidak memiliki izin untuk mengunduh arsip ini.",
            });
            return;
          default:
            toast.error("Gagal mengunduh arsip", {
              description: "Terjadi kesalahan saat mengunduh arsip.",
            });
            return;
        }
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="justify-start">
          <Download /> Unduh
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" }),
          );
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {Array.isArray(id)
              ? `Unduh ${id.length} Arsip Terpilih`
              : "Unduh Arsip"}
          </DialogTitle>
          <DialogDescription>
            {Array.isArray(id)
              ? `Anda akan mengunduh ${id.length} arsip terpilih. Pastikan Anda memiliki cukup ruang penyimpanan untuk file yang akan diunduh.`
              : "Anda akan mengunduh arsip ini."}
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle>Detail Arsip</CardTitle>
            <CardDescription>
              {Array.isArray(id)
                ? `Jumlah Arsip: ${id.length}`
                : `ID Arsip: ${id}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.isArray(id) ? (
                <Table>
                  <TableHeader>
                    {dataTableDetail.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="text-left">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {dataTableDetail.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <FieldGroup>
                  <Field
                    orientation={"horizontal"}
                    className="justify-between border-b"
                  >
                    <span className="font-sm text-muted-foreground">
                      Nama File
                    </span>
                    <span className="font-medium">
                      {singleQuery?.data?.file_name || "-"}
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
                      {singleQuery?.data?.mata_kuliah || "-"}
                    </span>
                  </Field>
                  <Field
                    orientation={"horizontal"}
                    className="justify-between border-b"
                  >
                    <span className="font-sm text-muted-foreground">
                      Tahun Ajaran
                    </span>
                    <span className="font-medium">
                      {singleQuery?.data?.tahun_ajaran || "-"}
                    </span>
                  </Field>
                </FieldGroup>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                Klik tombol di bawah untuk mengonfirmasi pengunduhan arsip ini.
              </p>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="default" onClick={() => mutate()}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : Array.isArray(id) ? (
              "Unduh Arsip Terpilih"
            ) : (
              "Unduh Arsip"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape" }),
              )
            }
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
