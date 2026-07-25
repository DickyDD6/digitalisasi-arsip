"use client";

import React from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type QCFilterCategoryOption = "all" | "Nilai" | "Transkrip" | "Ijazah" | "Sidang";

interface QCVerifiedDocumentFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: QCFilterCategoryOption;
  onCategoryFilterChange: (cat: QCFilterCategoryOption) => void;
  totalCount: number;
}

export function QCVerifiedDocumentFilter({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  totalCount,
}: QCVerifiedDocumentFilterProps) {
  return (
    <Card className="border border-border/60 bg-card shadow-xs">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama file, uploader, atau NPM..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        {/* Category Tabs Filter */}
        <Tabs
          value={categoryFilter}
          onValueChange={(val) => onCategoryFilterChange(val as any)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-5 h-9 text-xs">
            <TabsTrigger value="all" className="text-xs">
              Semua ({totalCount})
            </TabsTrigger>
            <TabsTrigger value="Nilai" className="text-xs">
              Nilai
            </TabsTrigger>
            <TabsTrigger value="Transkrip" className="text-xs">
              Transkrip
            </TabsTrigger>
            <TabsTrigger value="Ijazah" className="text-xs">
              Ijazah
            </TabsTrigger>
            <TabsTrigger value="Sidang" className="text-xs">
              Sidang
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}
