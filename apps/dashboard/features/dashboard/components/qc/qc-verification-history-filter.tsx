"use client";

import React from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QCVerificationHistoryFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | "verified" | "rejected";
  onStatusFilterChange: (status: "all" | "verified" | "rejected") => void;
  stats: {
    total: number;
    verified: number;
    rejected: number;
  };
}

export function QCVerificationHistoryFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stats,
}: QCVerificationHistoryFilterProps) {
  return (
    <Card className="border border-border/60 bg-card shadow-xs">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari file, uploader, atau catatan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        {/* Status Filter Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={(val) => onStatusFilterChange(val)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 h-9 text-xs">
            <TabsTrigger value="all" className="text-xs">
              Semua ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="verified" className="text-xs">
              Disetujui ({stats.verified})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs">
              Ditolak ({stats.rejected})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}
