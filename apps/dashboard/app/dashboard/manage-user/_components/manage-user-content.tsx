"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE } from "@/constants";
import { http } from "@/lib/http";
import { toSentenceCase } from "@/lib/sentence-case";
import { useQuery } from "@tanstack/react-query";
import { DataTableUsers } from "./data-table-users";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudAlert } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AddUserModal } from "./ui/add-user-modal";

export const ManagementUserContent = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users-statistic"],
    queryFn: async () => {
      const res = await http.get<ApiResponse<User[]>>("/api/users");
      return res.data;
    },
    select: (res) => {
      return {
        user_statistic: {
          all: {
            label: "Semua Pengguna",
            value: res.data.length,
          },
          ...Object.values(ROLE)
            .filter((role) => role !== "manager")
            .reduce(
              (acc, role) => {
                const count = res.data.filter(
                  (user) => user.role === role,
                ).length;
                acc[role] = {
                  label: `Tim ${role === "uploader" ? toSentenceCase(role) : role.toUpperCase()}`,
                  value: count,
                };
                return acc;
              },
              {} as Record<string, { label: string; value: number }>,
            ),
        },
      };
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manajemen Pengguna & Hak Akses</CardTitle>
            <AddUserModal />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent>
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-8" />
                  </CardContent>
                </Card>
              ))
            ) : isError ? (
              <Empty className="col-span-4">
                <EmptyHeader>
                  <EmptyMedia>
                    <CloudAlert />
                  </EmptyMedia>
                  <EmptyTitle>Gagal memuat statistik pengguna</EmptyTitle>
                  <EmptyDescription>
                    Terjadi kesalahan saat mengambil data statistik pengguna.
                  </EmptyDescription>
                </EmptyHeader>
                <Button variant="outline" onClick={() => refetch()}>
                  Coba Lagi
                </Button>
              </Empty>
            ) : data?.user_statistic ? (
              Object.entries(data?.user_statistic ?? {}).map(
                ([role, { label, value }]) => (
                  <Card key={role}>
                    <CardContent>
                      <CardTitle>{label}</CardTitle>
                      <span className="text-xl font-bold">{value}</span>
                    </CardContent>
                  </Card>
                ),
              )
            ) : null}
          </div>

          <DataTableUsers />
        </CardContent>
      </Card>
    </>
  );
};
