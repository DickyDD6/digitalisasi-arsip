interface ApiResponse<T = unknown> {
  message: string;
  data: T;
  meta?: MetaPagination;
}

interface MetaPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

type ApiError<TErrors = unknown, TDataError = unknown> = TDataError & {
  errors?: TErrors;
  message: string;
};
