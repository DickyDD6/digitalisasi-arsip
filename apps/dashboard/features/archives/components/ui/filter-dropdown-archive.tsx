import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { ColumnFiltersState, Header } from "@tanstack/react-table";
import { Funnel } from "lucide-react";

interface FilterDropdownArchiveProps<TData, TValue> {
  header: Header<TData, TValue>;
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  filterOptions: Record<string, { value: string; label: string }[]>;
}

export const FilterDropdownArchive = <TData, TValue>({
  header,
  setColumnFilters,
  filterOptions,
}: FilterDropdownArchiveProps<TData, TValue>) => {
  const currentFilter = header.column.getFilterValue();

  return (
    <div className="ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size={currentFilter ? "sm" : "icon"}
            />
          }
        >
          {currentFilter ? (
            <>
              {currentFilter.toString()}
              <Funnel className="w-3.5 h-3.5 ml-1" />
            </>
          ) : (
            <Funnel className="w-3.5 h-3.5" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="space-y-1">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setColumnFilters?.((prev) => [
                ...prev.filter((filter) => filter.id !== header.column.id),
              ]);
            }}
            className="cursor-pointer font-medium"
          >
            Reset Filter
          </DropdownMenuItem>
          {filterOptions[header.column.id]?.map((option) => {
            const isSelected = currentFilter === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  setColumnFilters?.((prev) => [
                    ...prev.filter((filter) => filter.id !== header.column.id),
                    {
                      id: header.column.id,
                      value: option.value,
                    },
                  ]);
                }}
                className={`cursor-pointer ${isSelected ? "font-bold text-[#F54A00]" : ""}`}
              >
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
