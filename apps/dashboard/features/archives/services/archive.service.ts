import { http } from "@/shared/lib/http";
import type {
  ArchiveListParams,
  ArchiveListResponse,
} from "../types/archive.types";

export const archiveService = {
  getArchiveList: async (
    params: ArchiveListParams = {},
  ): Promise<ArchiveListResponse> => {
    const { data } = await http.get<ApiResponse<ArchiveDocument[]>>(
      "/api/documents",
      {
        params,
      },
    );
    return data;
  },

  getFilterOptions: async (totalHint = 1000): Promise<ArchiveDocument[]> => {
    const { data } = await http.get<ApiResponse<ArchiveDocument[]>>(
      "/api/documents",
      {
        params: { per_page: totalHint },
      },
    );
    return data.data;
  },
};
