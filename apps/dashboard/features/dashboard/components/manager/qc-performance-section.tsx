import React, { useState } from "react";
import { Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { QCStaffStat } from "../../types/dashboard.types";

interface QCPerformanceSectionProps {
  isLoading?: boolean;
  data: QCStaffStat[];
}

export function QCPerformanceSection({ isLoading, data }: QCPerformanceSectionProps) {
  const [qcFilter, setQcFilter] = useState("minggu_ini");

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-card shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </Card>
    );
  }

  const hasData = data && data.length > 0;

  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Kinerja Staff QC (Minggu Ini)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Perbandingan produktivitas tim verifikasi
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Select value={qcFilter} onValueChange={setQcFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder="Select Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minggu_ini">Minggu Ini</SelectItem>
                <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
                <SelectItem value="tahun_ini">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-6">
        {hasData ? (
          <>
            {/* QC Bar Chart */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="staff" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                  />
                  <Bar dataKey="terverifikasi" name="Terverifikasi" fill="#00A63E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ditolak" name="Ditolak" fill="#E7000B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* QC Performance Table */}
            <div className="rounded-lg border border-border/60 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-foreground">Staff QC</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Terverifikasi</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Ditolak</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Waktu Rata-Rata</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground text-right">Tingkat Keberhasilan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-xs text-foreground">{row.staff}</TableCell>
                      <TableCell className="text-xs font-semibold text-emerald-600">{row.terverifikasi}</TableCell>
                      <TableCell className="text-xs text-foreground">{row.ditolak}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.avgTime}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px]">
                          {row.successRate}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground text-xs rounded-xl border border-dashed p-6">
            <span>Belum ada data kinerja staff QC tersedia.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
