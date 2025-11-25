import { PaginationMeta, PaginatedResponse } from '../interfaces/paginated-response.interface';

export class PaginationHelper {
    static createPaginationMeta(
        currentPage: number,
        itemsPerPage: number,
        totalItems: number
    ): PaginationMeta {
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return {
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
        };
    }

    static createPaginatedResponse<T>(
        data: T[],
        currentPage: number,
        itemsPerPage: number,
        totalItems: number
    ): PaginatedResponse<T> {
        const meta = this.createPaginationMeta(currentPage, itemsPerPage, totalItems);

        return {
            data,
            meta,
        };
    }
}