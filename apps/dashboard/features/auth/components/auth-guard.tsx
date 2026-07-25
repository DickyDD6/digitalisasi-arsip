"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { RoleThemeProvider } from "@/features/auth/components/role-theme-provider";
import { authQueries } from "@/features/auth/queries/auth.queries";
import { Flasher } from "@/shared/components/flasher";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(authQueries.userMe());

  React.useEffect(() => {
    if (!isLoading && (isError || user === null)) {
      router.replace("/login");
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <Flasher />;
  }

  if (!user) {
    return <Flasher />;
  }

  return <RoleThemeProvider>{children}</RoleThemeProvider>;
};
