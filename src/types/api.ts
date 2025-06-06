export interface ApiError {
	status: number;
	message: string;
}

export interface PaginationParams {
	page?: number;
	per_page?: number;
}

export interface SearchParams extends PaginationParams {
	query: string;
}

export interface ApiResponse<T> {
	data: T;
	error?: ApiError;
	status: number;
}