import { http } from "@/shared/lib/http";

export interface DocumentListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}

export const documentListService = {
  getDocuments: async (
    params: DocumentListParams = {},
  ): Promise<ApiResponse<ArchiveDocument[]>> => {
    const { data } = await http.get<ApiResponse<ArchiveDocument[]>>(
      "/api/documents",
      { params },
    );
    return data;
  },

  downloadDocument: async (id: number): Promise<Blob> => {
    const response = await http.get(`/api/documents/${id}/download`, {
      responseType: "blob",
    });
    return new Blob([response.data], { type: "application/pdf" });
  },
};
