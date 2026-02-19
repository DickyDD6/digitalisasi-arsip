"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { Loader2, LogOut } from "lucide-react";
import { Slot } from "radix-ui";
import React from "react";
import { useAuth } from "../_hooks/use-auth";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

export const LogoutButton = ({
  asChild,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot.Root : Button;
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Comp
      variant={"destructive"}
      type="button"
      onClick={() =>
        logout.mutate(undefined, {
          onSuccess: () => {
            toast.success("Logout berhasil!");
            router.replace("/login");
          },
          onError: (err) => {
            toast.error("Logout gagal", {
              description:
                err?.response?.data?.message ||
                "Terjadi kesalahan saat logout.",
            });
          },
        })
      }
      disabled={logout.isPending}
      {...props}
    >
      {logout.isPending ? (
        <Loader2 className="animate-spin duration-300" />
      ) : (
        <LogOut />
      )}
      Logout
    </Comp>
  );
};
