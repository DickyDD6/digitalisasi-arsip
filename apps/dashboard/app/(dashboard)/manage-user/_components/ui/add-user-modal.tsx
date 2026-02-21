"use client";

import { useAppForm } from "@/components/forms/form-context";
import {
  AddUserForm,
  AddUserFormOpts,
} from "@/components/forms/form/users/add-user-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserCreate } from "@/hooks/users/use-user-create";
import { isAxiosError } from "axios";
import { UserRoundPlus } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const AddUserModal = () => {
  const { mutateAsync, isPaused } = useUserCreate();

  const form = useAppForm({
    ...AddUserFormOpts,
    onSubmit: async ({ value }) => {
      await mutateAsync(value, {
        onSuccess: () => {
          toast.success("Pengguna berhasil ditambahkan ke sistem.", {
            description: "Periksa kembali data pengguna dalam tabel.",
          });
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" }),
          );
        },
        onError: (err) => {
          /* TODO: handle error */
          if (isAxiosError(err)) {
            switch (err.response?.status) {
              case 400:
                toast.error("Data tidak valid", {
                  description: "Pastikan semua field diisi dengan benar.",
                });
                break;
              case 422:
                if (err.response?.data.errors?.email) {
                  toast.error("Email sudah digunakan", {
                    description: err.response?.data.message,
                  });
                }
                break;
              case 500:
                toast.error("Kesalahan server", {
                  description:
                    "Terjadi kesalahan pada server. Coba lagi nanti.",
                });
                break;
              default:
                toast.error("Gagal menyimpan data pengguna", {
                  description:
                    "Terjadi kesalahan saat menyimpan data pengguna.",
                });
                break;
            }
          }
        },
      });
    },
  });

  useEffect(() => {
    if (isPaused) {
      toast.warning("Permintaan Ditunda", {
        description: "Akan dilanjutkan ketika koneksi kembali",
        duration: Infinity,
        id: "paused-mutation",
      });
    } else {
      toast.dismiss("paused-mutation");
    }
  }, [isPaused]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserRoundPlus />
          Tambah Pengguna
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
          <DialogTitle>Tambah Pengguna</DialogTitle>
          <DialogDescription>
            Menambah Pengguna baru ke sistem.
          </DialogDescription>
        </DialogHeader>

        <AddUserForm form={form} />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape" }),
              );
            }}
          >
            Batal
          </Button>

          <form.AppForm>
            <form.SubmitButton label="Tambah Pengguna" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
