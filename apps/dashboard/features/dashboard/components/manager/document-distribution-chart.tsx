import React, { useState } from "react";
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
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import type { DocumentTypeStat } from "../../types/dashboard.types";

interface DocumentDistributionChartProps {
  isLoading?: boolean;
  data: DocumentTypeStat[];
}

export function DocumentDistributionChart({ isLoading, data }: DocumentDistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card className="lg:col-span-1 border border-border/60 bg-card shadow-sm p-5 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-36" />
        <div className="flex items-center justify-center my-4">
          <Skeleton className="h-44 w-44 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
      </Card>
    );
  }

  const hasData = data && data.length > 0;
  const totalCount = hasData ? data.reduce((acc, curr) => acc + curr.count, 0) : 0;

  return (
    <Card className="lg:col-span-1 border border-border/60 bg-card shadow-sm flex flex-col justify-between">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Distribusi Jenis Dokumen
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Berdasarkan kategori dokumen
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-3 flex flex-col items-center justify-between gap-4 flex-1">
        {hasData ? (
          <>
            {/* Recharts Pie/Donut */}
            <div className="h-52 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={activeIndex === index ? "#fff" : "transparent"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => [
                      `${typeof value === "number" ? value.toLocaleString() : (value ?? "")} Dokumen`,
                      "",
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-muted-foreground font-medium">Total</span>
                <span className="text-lg font-bold text-foreground">
                  {totalCount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Custom Legend Grid */}
            <div className="w-full grid grid-cols-2 gap-2 text-xs pt-2">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col truncate">
                    <span className="font-medium text-foreground truncate">{item.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-64 w-full flex flex-col items-center justify-center text-muted-foreground text-xs rounded-xl border border-dashed p-6">
            <span>Belum ada data jenis dokumen tersedia.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
