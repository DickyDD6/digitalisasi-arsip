export interface ArchiveListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  document_type?: string;
  mata_kuliah?: string;
  tahun_ajaran?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export type ArchiveListResponse = ApiResponse<ArchiveDocument[]>;
