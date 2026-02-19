import { SidebarProvider } from "@/components/ui/sidebar";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { unauthorized } from "next/navigation";
import React from "react";
import { getServerUser } from "../(auth)/_lib/server-auth";
import { DashboardNavbar } from "./_components/dashboard-navbar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { getQueryClient } from "@/lib/query-instance";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    unauthorized();
  }

  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <DashboardSidebar />
        <div className="w-full h-screen flex flex-col transition-all duration-300 ease-in-out peer-data-[state=collapsed]:md:w-[calc(100vw-var(--sidebar-width-icon))] peer-data-[state=expanded]:md:w-[calc(100vw-var(--sidebar-width))]">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-5 px-4 py-4 pb-2 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
