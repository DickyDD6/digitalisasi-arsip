import React, { useState } from "react";
import { Calendar, Filter, X } from "lucide-react";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/ui/dialog";
import type { PeriodType } from "../../types/dashboard.types";

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onSelectPeriod: (period: PeriodType, startDate?: string, endDate?: string) => void;
  customStartDate?: string;
  customEndDate?: string;
}

export function PeriodFilter({
  selectedPeriod,
  onSelectPeriod,
  customStartDate = "",
  customEndDate = "",
}: PeriodFilterProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDateInput, setStartDateInput] = useState(customStartDate);
  const [endDateInput, setEndDateInput] = useState(customEndDate);

  const periods: { id: PeriodType; label: string }[] = [
    { id: "hari", label: "Hari Ini" },
    { id: "minggu", label: "Minggu Ini" },
    { id: "bulan", label: "Bulan Ini" },
    { id: "custom", label: "Custom Period" },
  ];

  const handlePeriodClick = (id: PeriodType) => {
    if (id === "custom") {
      setDialogOpen(true);
    } else {
      onSelectPeriod(id);
    }
  };

  const handleApplyCustomDate = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectPeriod("custom", startDateInput, endDateInput);
    setDialogOpen(false);
  };

  return (
    <>
      <Card className="border border-border/60 bg-card shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-[#F54A00]" />
            <span className="text-sm font-medium text-foreground">Filter Periode Data:</span>
            {selectedPeriod === "custom" && startDateInput && endDateInput && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#F54A00] font-mono border border-orange-200 dark:border-orange-800">
                {startDateInput} s/d {endDateInput}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {periods.map((item) => (
              <Button
                key={item.id}
                variant={selectedPeriod === item.id ? "default" : "outline"}
                size="sm"
                onClick={() => handlePeriodClick(item.id)}
                className={
                  selectedPeriod === item.id
                    ? "bg-[#F54A00] hover:bg-[#d64100] text-white shadow-sm font-medium"
                    : "hover:bg-muted text-foreground border-border/60"
                }
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Modal Custom Date Filter */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#F54A00]" />
              Pilih Rentang Tanggal Custom
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleApplyCustomDate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Tanggal Mulai</label>
              <Input
                type="date"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                required
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Tanggal Selesai</label>
              <Input
                type="date"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                required
                className="h-10 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="h-9 text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="h-9 text-xs bg-[#F54A00] hover:bg-[#d64100] text-white font-semibold"
              >
                Terapkan Periode
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
