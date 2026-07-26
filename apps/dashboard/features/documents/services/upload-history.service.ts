import { http } from "@/shared/lib/http";

export interface FetchUploadHistoryParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export const uploadHistoryService = {
  getUploadHistory: async (params: FetchUploadHistoryParams = {}) => {
    const cleanParams: Record<string, string | number> = {
      page: params.page ?? 1,
      per_page: params.per_page ?? 500,
      sort_by: params.sort_by ?? "created_at",
      sort_direction: params.sort_direction ?? "desc",
    };

    if (params.search) {
      cleanParams.search = params.search;
    }

    const { data } = await http.get<ApiResponse<ArchiveDocument[]>>(
      "/api/documents",
      { params: cleanParams },
    );
    return data;
  },
};
