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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CheckCircle, Edit, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  defaultValues,
  EditUserSchema,
  editUserSchema,
} from "../../schemas/user-schema";
import { EditForm } from "../forms/edit-form";

export const EditUserModal = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["user-edit", id],
    queryFn: async () => {
      const res = await http.get<ApiResponse<User>>(`/api/users/${id}`);
      return res.data;
    },
    enabled: !!id,
    select: (res) => ({
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      nip: res.data.nip || "",
    }),
  });

  const { mutateAsync, isPaused } = useMutation<
    ApiResponse<User>,
    AxiosError<ApiError<User>>,
    Partial<User>
  >({
    mutationKey: ["user-edit", id],
    mutationFn: async (editUser: Partial<User>) => {
      const res = await http.patch<ApiResponse<User>>(
        `/api/users/${id}`,
        editUser,
      );
      return res.data;
    },

    onSuccess: async () => {
      toast.dismiss("update-user");
      await queryClient.invalidateQueries({ queryKey: ["user-edit"] });
      await queryClient.invalidateQueries({ queryKey: ["users-table"] });
      toast.success("Data pengguna berhasil diperbarui", {
        description: "Perubahan pada data pengguna telah disimpan.",
      });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    },
    onMutate: () => {
      toast.loading("Memperbarui data pengguna...", {
        description: "Sedang memperbarui data pengguna, mohon tunggu.",
        id: "update-user",
      });
    },
    onError: (err) => {
      toast.dismiss("update-user");
      switch (err.response?.status) {
        case 400:
          toast.error("Data tidak valid", {
            description: "Pastikan semua field diisi dengan benar.",
          });
          break;
        case 404:
          toast.error("Pengguna tidak ditemukan", {
            description: "Pengguna yang ingin diperbarui tidak ditemukan.",
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
          toast.error("Gagal memperbarui data pengguna", {
            description: "Terjadi kesalahan saat memperbarui data pengguna.",
          });
          break;
      }
    },
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      const payload: EditUserSchema = {};
      for (const key in formApi.state.fieldMeta) {
        if (
          formApi.state.fieldMeta[key as keyof typeof value]?.isDirty &&
          !formApi.state.fieldMeta[key as keyof typeof value]?.isDefaultValue
        ) {
          payload[key as keyof typeof value] = value[key as keyof typeof value];
        }
      }

      const payloadIsValid = editUserSchema.safeParse(payload);

      if (payloadIsValid) await mutateAsync(payload);
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: editUserSchema,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

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
        <Button variant="ghost" className="w-full justify-start">
          <Edit />
          Edit
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
          <DialogTitle>Edit Data Pengguna</DialogTitle>
          <DialogDescription>Perbarui Informasi Pengguna</DialogDescription>
        </DialogHeader>

        <form.AppForm>
          <EditForm form={form} />

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
                isDirty: state.isDirty,
                isDefaultValue: state.isDefaultValue,
                canSubmit: state.canSubmit,
              })}
            >
              {(state) => (
                <Button
                  onClick={() => form.handleSubmit()}
                  disabled={
                    !state.canSubmit ||
                    !state.isDirty ||
                    state.isDefaultValue ||
                    state.isSubmitting
                  }
                >
                  {state.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CheckCircle />
                  )}{" "}
                  Simpan Perubahan
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
};
