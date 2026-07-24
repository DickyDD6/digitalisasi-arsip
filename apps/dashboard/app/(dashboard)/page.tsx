"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { authQueries } from "@/features/auth/queries/auth.queries";
import {
  ManagerDashboardView,
  QCDashboardView,
  SBAPDashboardView,
  UploaderDashboardView,
} from "@/features/dashboard";

export default function DashboardPage() {
  const { data: user, isLoading } = useQuery(authQueries.userMe());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const role = user?.role;

  switch (role) {
    case "uploader":
      return <UploaderDashboardView />;
    case "qc":
      return <QCDashboardView />;
    case "sbap":
      return <SBAPDashboardView />;
    case "manager":
    default:
      return <ManagerDashboardView />;
  }
}
