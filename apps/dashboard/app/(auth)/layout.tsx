import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import { getServerUser } from "./_lib/server-auth";
import { getQueryClient } from "@/lib/query-instance";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    const queryClient = getQueryClient();
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="min-h-screen place-items-center place-content-center">
          {children}
        </div>
      </HydrationBoundary>
    );
  }

  redirect("/dashboard");
}
