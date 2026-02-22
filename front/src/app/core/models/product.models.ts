export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    listPrice: number; // Used in lists
    categoryId: number;
    categoryName?: string;
    subCategoryId?: number;
    subCategoryName?: string;
    stockQuantity?: number;
    imageUrl?: string;
}

export interface ProductFilter {
    searchTerm?: string;
    categoryId?: number;
    subCategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page: number;
    pageSize: number;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    categoryId: number;
}

export interface UpdateProductDto extends CreateProductDto { }