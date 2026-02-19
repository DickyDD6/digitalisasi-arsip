"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { InputPassword } from "@/components/ui/password";
import { useTimeAgo } from "@/hooks/use-time-ago";
import { useForm } from "@tanstack/react-form-nextjs";
import { Loader2, UserRound } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { useAuth } from "../../_hooks/use-auth";
import { LoginSchema } from "../../_lib/schema";

export const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const { timeAgo } = useTimeAgo();

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginSchema,
    },
    onSubmit: ({ value }) =>
      login.mutate(
        { payload: value },
        {
          onSuccess: ({ data }) => {
            toast.success(data.message || "Login berhasil!");
            router.replace("/dashboard");
          },
          onError: (err) => {
            switch (err.status) {
              case 401:
                const lockedUntil = err?.response?.data?.locked_until;
                toast.error("Login gagal", {
                  description: `${err?.response?.data?.message || "Terjadi kesalahan saat login."}. Silahkan Coba Lagi ${lockedUntil ? `${timeAgo(lockedUntil)}` : ""}`,
                });
                router.replace("/login");
                break;
              case 403:
                toast.error("Akun Anda tidak memiliki akses.", {
                  description:
                    "Silakan hubungi administrator untuk mendapatkan akses.",
                });
                break;
              case 500:
                toast.error(
                  "Terjadi kesalahan server. Silakan coba lagi nanti.",
                  {
                    description:
                      "Jika masalah berlanjut, silakan hubungi dukungan teknis.",
                  },
                );
                break;
            }
          },
        },
      ),
  });

  return (
    <form
      id="login-form"
      onSubmit={async (e) => {
        e.preventDefault();
        await loginForm.handleSubmit();
      }}
    >
      <FieldSet>
        <loginForm.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <UserRound />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Masukkan Email Anda"
                  />
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </loginForm.Field>

        <loginForm.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputPassword
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Masukkan Password Anda"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </loginForm.Field>

        <Field orientation={"horizontal"}>
          <Field orientation={"horizontal"}>
            <Checkbox id="remember-me" />
            <FieldLabel htmlFor="remember-me">Remember Me</FieldLabel>
          </Field>
          <Button type={"button"} variant={"link"}>
            Forget Password?
          </Button>
        </Field>

        <Button form="login-form" type="submit">
          {login.isPending ? (
            <Loader2 className="animate-spin duration-300" />
          ) : (
            "LogIn"
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          &copy; 2026 Digital Archive. All rights reserved.
        </p>
      </FieldSet>
    </form>
  );
};
