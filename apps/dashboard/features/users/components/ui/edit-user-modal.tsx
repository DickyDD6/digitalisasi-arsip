"use client";

import { useAppForm } from "@/shared/components/forms/form-context";
import {
  EditUserForm,
  EditUserFormOpts,
} from "@/shared/components/forms/form/users/edit-user-form";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { useUserUpdate } from "@/features/users/hooks/use-user-update";
import { useUserUpdateDetail } from "@/features/users/hooks/use-user-detail";
import { USER_SCHEMA } from "@/features/users/schemas/user.schema";
import { isAxiosError } from "axios";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const EditUserModal = ({ id }: { id: number }) => {
  const { data } = useUserUpdateDetail(id);
  const { mutateAsync, isPaused } = useUserUpdate(id);

  const form = useAppForm({
    ...EditUserFormOpts,
    onSubmit: async ({ value, formApi }) => {
      const payload: Partial<UserSchema> = {};
      for (const key in formApi.state.fieldMeta) {
        if (
          formApi.state.fieldMeta[key as keyof typeof value]?.isDirty &&
          !formApi.state.fieldMeta[key as keyof typeof value]?.isDefaultValue
        ) {
          payload[key as keyof UserSchema] = value[
            key as keyof typeof value
          ] as Lowercase<UserRole>;
        }
      }

      const payloadIsValid = USER_SCHEMA.user.safeParse(payload);

      if (payloadIsValid)
        await mutateAsync(payload, {
          onSuccess: () => {
            toast.success("Data pengguna berhasil diperbarui", {
              description: "Perubahan pada data pengguna telah disimpan.",
            });
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Escape" }),
            );
          },
          /* TODO: handle error */
          onError: (err) => {
            if (isAxiosError(err)) {
              switch (err.response?.status) {
                case 400:
                  toast.error("Data tidak valid", {
                    description: "Pastikan semua field diisi dengan benar.",
                  });
                  break;
                case 404:
                  toast.error("Pengguna tidak ditemukan", {
                    description:
                      "Pengguna yang ingin diperbarui tidak ditemukan.",
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
                  toast.error("Gagal memperbarui data pengguna", {
                    description:
                      "Terjadi kesalahan saat memperbarui data pengguna.",
                  });
                  break;
              }
            }
          },
        });
    },
  });

  useEffect(() => {
    const responseObj = data as unknown as { data?: User };
    const userData = responseObj?.data || (data as unknown as User);
    if (userData && "email" in userData) {
      form.reset(userData);
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
      <DialogTrigger>
        <Button variant="ghost" className="w-full justify-start">
          <Edit />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Data Pengguna</DialogTitle>
          <DialogDescription>Perbarui Informasi Pengguna</DialogDescription>
        </DialogHeader>

        <EditUserForm form={form} />

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
            <form.SubmitButton label="Perbarui Pengguna" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
