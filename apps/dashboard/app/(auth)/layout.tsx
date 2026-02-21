import { getQueryClient } from "@/lib/query-instance";
import { AUTH_QUERY } from "@/queries/auth.query";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(AUTH_QUERY.userMeQuery());
    redirect("/");
  } catch {}

  return (
    <div className="min-h-screen place-items-center place-content-center">
      {children}
    </div>
  );
}
