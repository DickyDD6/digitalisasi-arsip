"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { http } from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const DeleteArchiveModal = ({ id }: { id: number | number[] }) => {
  const queryClient = useQueryClient();

  const { data: multipleQuery } = useQuery({
    queryKey: ["archive-detail-multiple", id],
    queryFn: async () => {
      const responses = await Promise.all(
        (id as number[]).map(async (singleId) =>
          http.get<ApiResponse<ArchiveDocument>>(`/api/documents/${singleId}`),
        ),
      );
      return responses.map((res) => res.data);
    },
    enabled: Array.isArray(id) && id.length > 0,
    select: (data) =>
      data.map((item) => ({
        id: item.data.id,
        file_name: item.data.file_name,
        document_type: item.data.document_type,
        mata_kuliah: item.data.mata_kuliah,
        tahun_ajaran: item.data.tahun_ajaran,
      })),
  });

  const { data: singleQuery } = useQuery({
    queryKey: ["archive-detail", id],
    queryFn: async () => {
      const { data } = await http.get<ApiResponse<ArchiveDocument>>(
        `/api/documents/${id}`,
      );
      return data;
    },
    enabled: !Array.isArray(id) && !!id,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (Array.isArray(id)) {
        await http.post("/api/documents/delete-multiple", {
          ids: id,
        });
      } else {
        await http.delete(`/api/documents/${id}`);
      }
    },
    onSuccess: async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await queryClient.invalidateQueries({ queryKey: ["archive-data"] });

      const count = Array.isArray(id) ? id.length : 1;
      toast.success(
        Array.isArray(id)
          ? `${count} arsip berhasil dihapus`
          : "Arsip berhasil dihapus",
        {
          description: Array.isArray(id)
            ? `${count} arsip telah dihapus dari sistem.`
            : "Arsip telah dihapus dari sistem.",
        },
      );
    },
    onError: (err) => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      if (isAxiosError(err)) {
        switch (err.response?.status) {
          case 404:
            toast.error("Arsip tidak ditemukan", {
              description:
                "Arsip yang ingin dihapus tidak ditemukan atau mungkin sudah dihapus.",
              onAutoClose: () =>
                toast.info(
                  "Hubungi administrator untuk bantuan lebih lanjut.",
                  {
                    description:
                      "Arsip mungkin sudah dihapus atau tidak pernah ada. Jika Anda yakin ini adalah kesalahan, Hubungi administrator untuk mendapatkan bantuan.",
                  },
                ),
              onDismiss: () =>
                toast.info(
                  "Hubungi administrator untuk bantuan lebih lanjut.",
                  {
                    description:
                      "Arsip mungkin sudah dihapus atau tidak pernah ada. Jika Anda yakin ini adalah kesalahan, Hubungi administrator untuk mendapatkan bantuan.",
                  },
                ),
            });
            return;
          case 403:
            toast.error("Gagal menghapus arsip", {
              description:
                "Anda tidak memiliki izin untuk menghapus arsip ini atau arsip dalam status menunggu verifikasi.",
            });
            return;
          default:
            toast.error("Gagal menghapus arsip", {
              description: "Terjadi kesalahan saat menghapus arsip.",
            });
            return;
        }
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 /> Hapus Arsip
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
              ? `Hapus ${id.length} Arsip Terpilih`
              : "Hapus Arsip"}
          </DialogTitle>
          <DialogDescription>
            {Array.isArray(id)
              ? `Apakah Anda yakin ingin menghapus ${id.length} arsip terpilih?`
              : "Apakah Anda yakin ingin menghapus arsip ini?"}
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
              <FieldGroup>
                {Array.isArray(id) && (
                  <Field
                    orientation={"horizontal"}
                    className="justify-between border-b"
                  >
                    <span className="font-sm text-muted-foreground">
                      ID Arsip
                    </span>
                    <span className="font-medium">{id.join(", ") || "-"}</span>
                  </Field>
                )}
                <Field
                  orientation={"horizontal"}
                  className="justify-between border-b"
                >
                  <span className="font-sm text-muted-foreground">
                    Nama File
                  </span>
                  <span className="font-medium">
                    {Array.isArray(id)
                      ? multipleQuery
                        ? multipleQuery
                            .map((item) => item.file_name)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : singleQuery?.data?.file_name || "-"}
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
                    {Array.isArray(id)
                      ? multipleQuery
                        ? multipleQuery
                            .map((item) => item.mata_kuliah)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : singleQuery?.data?.mata_kuliah || "-"}
                  </span>
                </Field>
                <Field
                  orientation={"horizontal"}
                  className="justify-between border-b"
                >
                  <span className="font-sm text-muted-foreground">
                    Jenis Dokumen
                  </span>
                  <span className="font-medium">
                    {Array.isArray(id)
                      ? multipleQuery
                        ? multipleQuery
                            .map((item) => item.document_type)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : singleQuery?.data?.document_type || "-"}
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
                    {Array.isArray(id)
                      ? multipleQuery
                        ? multipleQuery
                            .map((item) => item.tahun_ajaran)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : singleQuery?.data?.tahun_ajaran || "-"}
                  </span>
                </Field>
              </FieldGroup>
              <p className="text-sm text-muted-foreground mt-4">
                Klik tombol di bawah untuk mengonfirmasi penghapusan arsip ini.
              </p>
            </div>
          </CardContent>
        </Card>

        <Alert variant="destructive">
          <Trash2 />
          <AlertTitle>Peringatan!</AlertTitle>
          <AlertDescription>
            Tindakan ini tidak dapat dibatalkan. Pastikan Anda yakin ingin
            menghapus{" "}
            {Array.isArray(id) ? `${id.length} arsip ini` : "arsip ini"}.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={async () => await mutateAsync()}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}{" "}
            {Array.isArray(id) ? "Hapus Arsip Terpilih" : "Hapus Arsip"}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape" }),
              )
            }
            disabled={isPending}
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
