import React from "react";
import { Button } from "@repo/ui/button";

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

interface DocumentListPaginationProps {
  meta: PaginationMeta | undefined;
  page: number;
  onPageChange: (page: number) => void;
}

export function DocumentListPagination({
  meta,
  page,
  onPageChange,
}: DocumentListPaginationProps) {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs text-muted-foreground">
        Menampilkan Halaman {meta.current_page} dari {meta.last_page} (
        {meta.total} Dokumen)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="text-xs h-8"
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= meta.last_page}
          onClick={() => onPageChange(page + 1)}
          className="text-xs h-8"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
