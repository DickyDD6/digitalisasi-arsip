"use client";

import { Button, type buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { Loader2, LogOut } from "lucide-react";
import { Slot } from "radix-ui";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { useLogout } from "@/hooks/auth/use-logout";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export const LogoutButton = ({
  asChild,
  withIcon = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    withIcon?: boolean;
    children: React.ReactNode;
  }) => {
  const Comp = asChild ? Slot.Root : Button;
  const router = useRouter();
  const { mutateAsync, isPending } = useLogout();
  const queryClient = useQueryClient();

  return (
    <Comp
      variant={"destructive"}
      type="button"
      onClick={async () =>
        await mutateAsync(undefined, {
          onSuccess: () => {
            toast.success("Logout berhasil!");
            queryClient.invalidateQueries({ queryKey: ["current", "user"] });
            router.replace("/login");
          },
          onError: (err) => {
            if (isAxiosError(err)) {
              toast.error("Logout gagal", {
                description:
                  err?.response?.data?.message ||
                  "Terjadi kesalahan saat logout.",
              });
            }
          },
        })
      }
      disabled={isPending}
      {...props}
    >
      {isPending ? (
        <Loader2 className="animate-spin duration-300" />
      ) : (
        withIcon && <LogOut className="size-4" />
      )}
      {children}
    </Comp>
  );
};
