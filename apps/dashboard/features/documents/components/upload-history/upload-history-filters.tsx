import React from "react";
import { Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadHistoryFiltersProps {
  selectedPeriod: string;
  onPeriodChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
}

export function UploadHistoryFilters({
  selectedPeriod,
  onPeriodChange,
  selectedStatus,
  onStatusChange,
}: UploadHistoryFiltersProps) {
  return (
    <Card className="border border-border/60 bg-card shadow-sm p-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span>Filter Riwayat:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Periode Filter */}
          <Select value={selectedPeriod} onValueChange={(val) => onPeriodChange(val || "")}>
            <SelectTrigger className="w-full sm:w-44 h-10 text-xs">
              <SelectValue placeholder="Semua Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Periode</SelectItem>
              <SelectItem value="7d" className="text-xs">7 Hari Terakhir</SelectItem>
              <SelectItem value="30d" className="text-xs">30 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter matching API status parameters: 'menunggu_verifikasi', 'terverifikasi', 'tidak_terverifikasi' */}
          <Select value={selectedStatus} onValueChange={(val) => onStatusChange(val || "")}>
            <SelectTrigger className="w-full sm:w-44 h-10 text-xs">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Status</SelectItem>
              <SelectItem value="terverifikasi" className="text-xs">Terverifikasi</SelectItem>
              <SelectItem value="menunggu_verifikasi" className="text-xs">Menunggu Verifikasi</SelectItem>
              <SelectItem value="tidak_terverifikasi" className="text-xs">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
