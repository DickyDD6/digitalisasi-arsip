"use client";

import { AUTH_QUERY } from "@/queries/auth.query";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { Flasher } from "./flasher";

// TODO: Pindah ke .env
const TOKEN_KEY = "token";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    setToken(window.localStorage.getItem(TOKEN_KEY));
    setReady(true);
  }, []);

  const currentUserQuery = useQuery({
    ...AUTH_QUERY.userMeQuery(),
    enabled: ready && !!token,
    retry: false,
  });

  React.useEffect(() => {
    if (!ready) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (currentUserQuery.isError) {
      window.localStorage.removeItem(TOKEN_KEY);
      router.replace("/login");
    }
  }, [ready, token, currentUserQuery.isError, router]);

  if (!ready || !token || currentUserQuery.isLoading) {
    return <Flasher />;
  }

  return <>{children}</>;
};
