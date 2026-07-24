"use client";

import { Button, type buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { Loader2, LogOut } from "lucide-react";
import { Slot } from "radix-ui";
import React from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";

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
  const { logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    try {
      toast.info("Sedang keluar...", { id: "logout-toast" });
      await logout();
    } catch {
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-role", "default");
        window.location.href = "/login";
      }
    }
  };

  return (
    <Comp
      variant={"destructive"}
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      {...props}
    >
      {isLoggingOut ? (
        <Loader2 className="animate-spin duration-300" />
      ) : (
        withIcon && <LogOut className="size-4" />
      )}
      {children}
    </Comp>
  );
};
