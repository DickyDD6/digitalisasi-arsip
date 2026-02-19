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

export const DeleteUserModal = ({ id }: { id: number | number[] }) => {
  const queryClient = useQueryClient();

  const { data: multipleQuery } = useQuery({
    queryKey: ["user-delete-multiple", id],
    queryFn: async () => {
      const responses = await Promise.all(
        (id as number[]).map(async (singleId) =>
          http.get<ApiResponse<User>>(`/api/users/${singleId}`),
        ),
      );
      return responses.map((res) => res.data);
    },
    enabled: Array.isArray(id) && id.length > 0,
    select: (data) =>
      data.map((item) => ({
        id: item.data.id,
        name: item.data.name,
        email: item.data.email,
        nip: item.data.nip,
        role: item.data.role,
      })),
  });

  const { data: singleQuery } = useQuery({
    queryKey: ["user-delete", id],
    queryFn: async () => {
      const { data } = await http.get<ApiResponse<User>>(`/api/users/${id}`);
      return data;
    },
    enabled: !Array.isArray(id) && !!id,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (Array.isArray(id)) {
        await http.post("/api/users/delete-multiple", {
          ids: id,
        });
      } else {
        await http.delete(`/api/users/${id}`);
      }
    },
    onSuccess: async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await queryClient.invalidateQueries({ queryKey: ["users-table"] });

      const count = Array.isArray(id) ? id.length : 1;
      toast.success(
        Array.isArray(id)
          ? `${count} pengguna berhasil dihapus`
          : "Pengguna berhasil dihapus",
        {
          description: Array.isArray(id)
            ? `${count} pengguna telah dihapus dari sistem.`
            : "Pengguna telah dihapus dari sistem.",
        },
      );
    },
    onError: (err) => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      if (isAxiosError(err)) {
        console.log(err.response);
        switch (err.response?.status) {
          case 404:
            toast.error("Pengguna tidak ditemukan", {
              description:
                "Pengguna yang ingin dihapus tidak ditemukan atau mungkin sudah dihapus.",
              onAutoClose: () =>
                toast.info(
                  "Hubungi administrator untuk bantuan lebih lanjut.",
                  {
                    description:
                      "Pengguna mungkin sudah dihapus atau tidak pernah ada. Jika Anda yakin ini adalah kesalahan, Hubungi administrator untuk mendapatkan bantuan.",
                  },
                ),
              onDismiss: () =>
                toast.info(
                  "Hubungi administrator untuk bantuan lebih lanjut.",
                  {
                    description:
                      "Pengguna mungkin sudah dihapus atau tidak pernah ada. Jika Anda yakin ini adalah kesalahan, Hubungi administrator untuk mendapatkan bantuan.",
                  },
                ),
            });
            return;
          case 403:
            toast.error("Gagal menghapus pengguna", {
              description:
                "Anda tidak memiliki izin untuk menghapus pengguna ini atau pengguna dalam status menunggu verifikasi.",
            });
            return;
          default:
            toast.error("Gagal menghapus pengguna", {
              description: "Terjadi kesalahan saat menghapus pengguna.",
            });
            return;
        }
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} className="justify-start w-full">
          <Trash2 /> Hapus Pengguna
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
        className={"sm:max-h-lg sm:max-w-2xl"}
      >
        <DialogHeader>
          <DialogTitle>
            {Array.isArray(id)
              ? `Hapus ${id.length} Pengguna Terpilih`
              : "Hapus Pengguna"}
          </DialogTitle>
          <DialogDescription>
            {Array.isArray(id)
              ? `Apakah Anda yakin ingin menghapus ${id.length} pengguna terpilih?`
              : "Apakah Anda yakin ingin menghapus pengguna ini?"}
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle>Detail Pengguna</CardTitle>
            <CardDescription>
              {Array.isArray(id)
                ? `Jumlah Pengguna: ${id.length}`
                : `ID Pengguna: ${id}`}
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
                      ID Pengguna
                    </span>
                    <span className="font-medium">{id.join(", ") || "-"}</span>
                  </Field>
                )}
                <Field
                  orientation={"horizontal"}
                  className="justify-between border-b"
                >
                  <span className="font-sm text-muted-foreground">
                    Nama Pengguna
                  </span>
                  <span className="font-medium">
                    {Array.isArray(id)
                      ? multipleQuery
                        ? multipleQuery
                            .map((item) => item.name)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : singleQuery?.data?.name || "-"}
                  </span>
                </Field>
                <Field
                  orientation={"horizontal"}
                  className="justify-between border-b"
                >
                  <span className="font-sm text-muted-foreground">
                    Email Pengguna
                  </span>
                  <span className="font-medium">
                    {Array.isArray(id)
                      ? multipleQuery
                        ? multipleQuery
                            .map((item) => item.email)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : singleQuery?.data?.email || "-"}
                  </span>
                </Field>
                <Field
                  orientation={"horizontal"}
                  className="justify-between border-b"
                >
                  <span className="font-sm text-muted-foreground">
                    NIP Pengguna
                  </span>
                  <span className="font-medium">
                    {Array.isArray(id)
                      ? multipleQuery
                        ? multipleQuery
                            .map((item) => item.nip)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : singleQuery?.data?.nip || "-"}
                  </span>
                </Field>
                <Field
                  orientation={"horizontal"}
                  className="justify-between border-b"
                >
                  <span className="font-sm text-muted-foreground">
                    Role Pengguna
                  </span>
                  <span className="font-medium">
                    {Array.isArray(id)
                      ? multipleQuery
                        ? multipleQuery
                            .map((item) => item.role)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : singleQuery?.data?.role || "-"}
                  </span>
                </Field>
              </FieldGroup>
              <p className="text-sm text-muted-foreground mt-4">
                Klik tombol di bawah untuk mengonfirmasi penghapusan pengguna
                ini.
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
            {Array.isArray(id) ? `${id.length} pengguna ini` : "pengguna ini"}.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={async () => await mutateAsync()}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}{" "}
            {Array.isArray(id) ? "Hapus Pengguna Terpilih" : "Hapus Pengguna"}
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
