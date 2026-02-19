export interface ApiResponse<T = unknown> {
	message: string;
	data: T;
	meta?: MetaPagination;
}

export interface MetaPagination {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
}

export interface ApiError {
	message: string;
	errors?: any;
}
