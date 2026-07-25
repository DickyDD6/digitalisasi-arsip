import React, { useState } from "react";
import { Filter, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
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

const ITEMS_PER_PAGE = 10;

export function QCPerformanceSection({ isLoading, data }: QCPerformanceSectionProps) {
  const [qcFilter, setQcFilter] = useState("minggu_ini");
  const [currentPage, setCurrentPage] = useState(1);

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
  const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = hasData ? data.slice(startIndex, startIndex + ITEMS_PER_PAGE) : [];

  const activeOnlineCount = data.filter((s) => s.isOnline).length;
  // Chart shows top 10 productive staff for clean visual representation
  const chartData = hasData ? [...data].sort((a, b) => b.terverifikasi - a.terverifikasi).slice(0, 10) : [];

  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold text-foreground">
                Kinerja Staff QC ({data.length} Total Staff)
              </CardTitle>
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[11px] gap-1.5 px-2 py-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {activeOnlineCount} Staff Online
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Monitoring produktivitas &amp; status aktif tim verifikasi QC
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 border-border/60">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Select value={qcFilter} onValueChange={(val) => setQcFilter(val || "")}>
              <SelectTrigger className="w-[140px] h-9 text-xs border-border/60">
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
            {/* QC Bar Chart (Top 10 Verifikator Teratas) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Grafik 10 Staff Paling Produktif</span>
                <span>Menampilkan 10 dari {data.length} Staf QC</span>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="staff" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
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
            </div>

            {/* QC Performance Table (Maksimal 10 Baris per Halaman + Akurasi Verifikasi) */}
            <div className="rounded-lg border border-border/60 overflow-hidden space-y-0 shadow-2xs">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-foreground">Staff QC</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Status Aktif</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Terverifikasi</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Ditolak</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground">Waktu Rata-Rata</TableHead>
                    <TableHead className="font-semibold text-xs text-foreground text-right">Akurasi Verifikasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, index) => (
                    <TableRow key={row.id || index} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-xs text-foreground">
                        <div className="flex flex-col">
                          <span className="font-semibold">{row.staff}</span>
                          {row.role && (
                            <span className="text-[11px] text-muted-foreground">{row.role}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {row.isOnline ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                            <Circle className="w-1.5 h-1.5 fill-zinc-400 text-zinc-400" />
                            {row.lastSeen || "Offline"}
                          </span>
                        )}
                      </TableCell>
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

              {/* Controls Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground">
                    Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} dari {data.length} Staf QC
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-8 px-2.5 text-xs gap-1 border-border/60"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </Button>
                    <span className="px-2 font-semibold text-foreground">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-8 px-2.5 text-xs gap-1 border-border/60"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
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
