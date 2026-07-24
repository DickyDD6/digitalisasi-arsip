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
import { useUserDelete } from "@/features/users/hooks/use-user-delete";
import { useUserDeleteDetail } from "@/features/users/hooks/use-user-detail";
import { useUserDeleteMultiple } from "@/features/users/hooks/use-user-delete";
import { useUserDeleteMultipleDetail } from "@/features/users/hooks/use-user-detail";
import { isAxiosError } from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteUserModal = ({ id }: { id: number | number[] }) => {
  const { data: singleQuery } = useUserDeleteDetail(id as number);
  const { data: multipleQuery } = useUserDeleteMultipleDetail(id as number[]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { mutateAsync: singleDelete, isPending: pendingSingleDelete } =
    useUserDelete();
  const { mutateAsync: multipleDelete, isPending: pendingMultipleDelete } =
    useUserDeleteMultiple();

  const handleDelete = async () => {
    if (Array.isArray(id)) {
      await multipleDelete(id, {
        onSuccess: () => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" }),
          );
          toast.success(`${id.length} pengguna berhasil dihapus`, {
            description: `${id.length} pengguna telah dihapus dari sistem.`,
          });
        },
        onError: (err) => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" }),
          );

          if (isAxiosError(err)) {
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
    } else {
      await singleDelete(id, {
        onSuccess: () => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" }),
          );
          toast.success("Pengguna berhasil dihapus", {
            description: "Pengguna telah dihapus dari sistem.",
          });
        },
        /* TODO: handle error */
        onError: (err) => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" }),
          );

          if (isAxiosError(err)) {
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
    }
  };

  const isLoading = pendingSingleDelete || pendingMultipleDelete;

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        if (id === undefined) return;
        setOpenDialog(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          className="justify-start w-full"
          disabled={
            isLoading ||
            (singleQuery as any)?.data?.role === "manager" ||
            (multipleQuery as any)?.some?.((user: any) => user.role === "manager")
          }
        >
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
                      ? Array.isArray(multipleQuery)
                        ? multipleQuery
                            .map((item: any) => item.name)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : (singleQuery as any)?.data?.name || "-"}
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
                      ? Array.isArray(multipleQuery)
                        ? (multipleQuery as any[])
                            .map((item: any) => item.email)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : (singleQuery as any)?.data?.email || "-"}
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
                      ? Array.isArray(multipleQuery)
                        ? (multipleQuery as any[])
                            .map((item: any) => item.nip)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : (singleQuery as any)?.data?.nip || "-"}
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
                      ? Array.isArray(multipleQuery)
                        ? (multipleQuery as any[])
                            .map((item: any) => item.role)
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                      : (singleQuery as any)?.data?.role || "-"}
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
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Trash2 />}{" "}
            {Array.isArray(id) ? "Hapus Pengguna Terpilih" : "Hapus Pengguna"}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape" }),
              )
            }
            disabled={isLoading}
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
