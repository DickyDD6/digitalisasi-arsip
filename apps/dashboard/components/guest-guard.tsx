"use client";

import { AUTH_QUERY } from "@/queries/auth.query";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { Flasher } from "./flasher";

// TODO: Pindah ke .env
const TOKEN_KEY = "token";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = React.useState<string | null | undefined>(
    undefined,
  );

  React.useEffect(() => {
    setToken(window.localStorage.getItem(TOKEN_KEY));
  }, []);

  const hasToken = !!token;

  const meQuery = useQuery({
    ...AUTH_QUERY.userMeQuery(),
    enabled: hasToken,
    retry: false,
  });

  React.useEffect(() => {
    if (token === undefined) return;
    if (!hasToken) return;

    if (meQuery.isSuccess) {
      router.replace("/");
      return;
    }

    if (meQuery.isError) {
      window.localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    }
  }, [token, meQuery.isSuccess, meQuery.isError, router, hasToken]);

  if (hasToken || token === undefined) return <Flasher />;

  return <>{children}</>;
};
