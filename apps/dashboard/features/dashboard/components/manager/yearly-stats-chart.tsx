import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import type { YearlyStat } from "../../types/dashboard.types";

interface YearlyStatsChartProps {
  isLoading?: boolean;
  data: YearlyStat[];
}

export function YearlyStatsChart({ isLoading, data }: YearlyStatsChartProps) {
  if (isLoading) {
    return (
      <Card className="lg:col-span-2 border border-border/60 bg-card shadow-sm p-5 space-y-4">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-72" />
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </Card>
    );
  }

  const hasData = data && data.length > 0;

  return (
    <Card className="lg:col-span-2 border border-border/60 bg-card shadow-sm flex flex-col justify-between">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Statistik Arsip Digital (2000-2010)
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Distribusi dokumen yang telah didigitalisasi per tahun
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-3 space-y-6">
        {/* Recharts Bar Chart (Yearly Distribution) */}
        {hasData ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                />
                <Bar dataKey="nilai" name="Nilai" fill="var(--chart-1)" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="transkrip" name="Transkrip" fill="var(--chart-2)" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-xs rounded-xl border border-dashed p-6">
            <span>Belum ada data statistik tahunan tersedia.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
