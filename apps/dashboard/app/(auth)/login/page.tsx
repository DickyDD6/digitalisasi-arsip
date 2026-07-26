"use client";

import { useAppForm } from "@/shared/components/forms/form-context";
import {
  LoginForm,
  loginFormOptions,
} from "@/shared/components/forms/form/auth/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { FieldSet } from "@repo/ui/field";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useTimeAgo } from "@/shared/hooks/use-time-ago";
import { isAxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync } = useLogin();
  const { timeAgo } = useTimeAgo();

  const form = useAppForm({
    ...loginFormOptions,
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          email: value.email,
          password: value.password,
        });

        toast.success("Login Berhasil", {
          description: "Selamat datang di Sistem Digital Arsip FT Unpas.",
        });
        router.replace("/");
      } catch (err) {
        if (isAxiosError(err)) {
          const status = err.response?.status;
          const backendMsg = err.response?.data?.message;
          const lockedUntil = err.response?.data?.locked_until;

          const errorMsg =
            backendMsg ||
            "Email atau password salah. Silakan periksa kembali credentials Anda.";

          if (status === 401 || status === 422 || status === 400) {
            toast.error("Login Gagal", {
              description: `${errorMsg}${lockedUntil ? `. Silakan coba lagi ${timeAgo(lockedUntil)}` : ""}`,
            });
          } else if (status === 403) {
            toast.error("Akses Ditolak", {
              description: "Akun Anda tidak memiliki akses ke sistem.",
            });
          } else {
            toast.error("Terjadi Kesalahan Server", {
              description: errorMsg || "Silakan coba beberapa saat lagi.",
            });
          }
        } else {
          toast.error("Login Gagal", {
            description: "Email atau password salah. Silakan coba lagi.",
          });
        }
      }
    },
  });

  return (
    <Card className="w-full lg:w-300 py-0 overflow-hidden lg:grid lg:grid-cols-2">
      <div className="bg-[url('/img/login-bg-card.png')] hidden lg:block bg-[#F54A00]/5 bg-cover bg-center h-150">
        <div className="bg-black/30 h-full py-6 px-4">
          <div className="flex items-center gap-2">
            <Image
              src={"/img/logo-univ.png"}
              alt="logo-universitas-pasundan"
              width={40}
              height={40}
            />
            <Image
              src={"/img/logo-ft.png"}
              alt="logo-fakultas-teknik"
              width={40}
              height={40}
            />
            <div className="flex flex-col justify-center text-primary-foreground">
              <h1 className="font-semibold text-3xl">Digital Archive</h1>
              <p className="text-primary-foreground text-xs font-light">
                Fakultas Teknik Universitas Pasundan
              </p>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="space-y-5 py-6 place-content-center">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Masukkan Credentials Anda untuk Melanjutkan.
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldSet>
            <LoginForm form={form} />

            <form.AppForm>
              <form.SubmitButton label="Login" />
            </form.AppForm>
            <p className="text-center text-xs text-muted-foreground">
              &copy; 2026 Digital Archive. All rights reserved.
            </p>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
