import React from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PeriodType } from "../../types/dashboard.types";

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onSelectPeriod: (period: PeriodType) => void;
}

export function PeriodFilter({ selectedPeriod, onSelectPeriod }: PeriodFilterProps) {
  const periods: { id: PeriodType; label: string }[] = [
    { id: "hari", label: "Hari Ini" },
    { id: "minggu", label: "Minggu Ini" },
    { id: "bulan", label: "Bulan Ini" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <Card className="border border-border/60 bg-card shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-foreground">Periode Data:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {periods.map((item) => (
            <Button
              key={item.id}
              variant={selectedPeriod === item.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectPeriod(item.id)}
              className={
                selectedPeriod === item.id
                  ? "bg-[#F54A00] hover:bg-[#d64100] text-white shadow-sm font-medium"
                  : "hover:bg-muted text-foreground"
              }
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
