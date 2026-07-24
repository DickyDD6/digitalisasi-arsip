import { queryOptions } from "@tanstack/react-query";
import { archiveService } from "../services/archive.service";
import type { ArchiveListParams } from "../types/archive.types";

export const archiveQueries = {
  all: ["archive"] as const,

  list: (params: ArchiveListParams = {}) =>
    queryOptions({
      queryKey: [...archiveQueries.all, "list", params],
      queryFn: () => archiveService.getArchiveList(params),
      placeholderData: (prev) => prev,
      staleTime: 1000 * 60 * 2,
    }),

  filterOptions: (totalHint?: number) =>
    queryOptions({
      queryKey: [...archiveQueries.all, "filter-options"],
      queryFn: () => archiveService.getFilterOptions(totalHint),
      staleTime: 1000 * 60 * 5,
      select: (data) =>
        data.map((item) => ({
          mata_kuliah: item.mata_kuliah,
          tahun_ajaran: item.tahun_ajaran,
        })),
    }),
};
