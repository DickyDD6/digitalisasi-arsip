import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Filter, Search } from "lucide-react";

interface DocumentListFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "terverifikasi", label: "Terverifikasi" },
  { value: "menunggu verifikasi", label: "Menunggu Verifikasi" },
  { value: "tidak terverifikasi", label: "Ditolak" },
];

export function DocumentListFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: DocumentListFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <InputGroup className="w-full sm:max-w-md">
        <InputGroupAddon>
          <Search className="w-4 h-4 text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Cari dokumen..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        <Select
          value={selectedStatus}
          onValueChange={(val) => onStatusChange(val || "")}
        >
          <SelectTrigger className="w-full sm:w-48 h-10 text-xs">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
