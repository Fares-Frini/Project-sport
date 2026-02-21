export interface SubCategory {
    id: number;
    categoryId: number;
    categoryName?: string;
    name: string;
    description?: string;
    productCount?: number;
}

export interface CreateSubCategoryDto {
    categoryId: number;
    name: string;
    description?: string;
}

export interface UpdateSubCategoryDto {
    id: number;
    categoryId: number;
    name: string;
    description?: string;
}
