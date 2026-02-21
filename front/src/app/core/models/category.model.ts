export interface Category {
    id: number;
    name: string;
    description?: string;
    subCategoryCount?: number;
}

export interface CreateCategoryDto {
    name: string;
}

export interface UpdateCategoryDto {
    name: string;
}
