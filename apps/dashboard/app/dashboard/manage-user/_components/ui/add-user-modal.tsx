"use client";

import { useAppForm } from "@/components/forms/form-context";
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
import { http } from "@/lib/http";
import { revalidateLogic } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CheckCircle, Loader2, UserRoundPlus } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { addUserSchema, defaultValues } from "../../schemas/user-schema";
import { AddUserForm } from "../forms/add-form";

export const AddUserModal = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPaused } = useMutation<
    ApiResponse<User>,
    AxiosError<ApiError<User>>,
    Partial<User>
  >({
    mutationKey: ["user-add"],
    mutationFn: async (addUser: Partial<User>) => {
      const res = await http.post<ApiResponse<User>>("/api/users", addUser);
      return res.data;
    },
    onMutate: () => {
      toast.loading("Menyimpan data pengguna...", {
        description: "Sedang menyimpan data pengguna, mohon tunggu...",
        id: "add-user",
      });
    },
    onSuccess: async () => {
      toast.dismiss("add-user");
      await queryClient.invalidateQueries({ queryKey: ["users-table"] });
      toast.success("Pengguna berhasil ditambahkan ke sistem.", {
        description: "Periksa kembali data pengguna dalam tabel.",
      });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    },
    onError: (err) => {
      toast.dismiss("update-user");
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
            description: "Terjadi kesalahan pada server. Coba lagi nanti.",
          });
          break;
        default:
          toast.error("Gagal menyimpan data pengguna", {
            description: "Terjadi kesalahan saat menyimpan data pengguna.",
          });
          break;
      }
    },
  });

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: addUserSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
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

          <form.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
              canSubmit: state.canSubmit,
            })}
          >
            {(state) => (
              <Button
                onClick={() => form.handleSubmit()}
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle />
                )}{" "}
                Simpan Pengguna
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
