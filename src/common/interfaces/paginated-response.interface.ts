export interface PaginationMeta {
	readonly currentPage: number;
	readonly itemsPerPage: number;
	readonly totalItems: number;
	readonly totalPages: number;
	readonly hasNextPage: boolean;
	readonly hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
	readonly data: T[];
	readonly meta: PaginationMeta;
}
