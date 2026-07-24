import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  return (
    <div className="ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={header.column.getFilterValue() ? "sm" : "icon"}
          >
            {header.column.getFilterValue() ? (
              <>
                {header.column.getFilterValue()?.toString()}
                <Funnel />
              </>
            ) : (
              <Funnel />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="space-y-2">
          <DropdownMenuItem asChild className="cursor-pointer w-full">
            <Button
              onClick={() => {
                setColumnFilters?.((prev) => [
                  ...prev.filter((filter) => filter.id !== header.column.id),
                ]);
              }}
              variant={"destructive"}
            >
              Reset Filter
            </Button>
          </DropdownMenuItem>
          {filterOptions[header.column.id]?.map((option) => (
            <DropdownMenuItem
              key={option.value}
              asChild
              className="cursor-pointer w-full"
            >
              <Button
                onClick={() => {
                  setColumnFilters?.((prev) => [
                    ...prev.filter((filter) => filter.id !== header.column.id),
                    {
                      id: header.column.id,
                      value: option.value,
                    },
                  ]);
                }}
                variant={
                  header.column.getFilterValue() === option.value
                    ? "default"
                    : "ghost"
                }
              >
                {option.label}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
