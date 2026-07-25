"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { authQueries } from "@/features/auth/queries/auth.queries";
import { Flasher } from "@/shared/components/flasher";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { data: user, isLoading } = useQuery(authQueries.userMe());

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <Flasher />;
  }

  if (user) {
    return <Flasher />;
  }

  return <>{children}</>;
};
