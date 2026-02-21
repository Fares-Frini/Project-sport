export interface GlobalKPIs {
    totalRevenue: number;
    revenueGrowth?: number;
    totalOrders: number;
    ordersGrowth?: number;
    averageBasket?: number;
    basketGrowth?: number;
    totalCustomers: number;
    customersGrowth?: number;
    avgOrderValue?: number;
    topCategory?: string;
    topCity?: string;
}

export interface CategorySales {
    categoryId?: number;
    categoryName: string;
    totalRevenue: number;
    totalQuantity?: number;
    percentage?: number;
    nbOrders?: number;
}

export interface CitySales {
    city: string;
    stateProvince?: string;
    country?: string;
    totalRevenue: number;
    nbOrders?: number;
    nbCustomers?: number;
}

export interface CountrySales {
    country: string;
    countryCode?: string;
    totalRevenue: number;
    percentage?: number;
    nbOrders?: number;
    nbCities?: number;
}

export interface SalesTrend {
    date: string; // or Date
    revenue: number;
    orders: number;
    year?: number;
    month?: number;
    monthName?: string;
    quarter?: number;
}

export interface ProductSales {
    productId?: number;
    productName: string;
    categoryName: string;
    subCategoryName?: string;
    quantitySold?: number;
    totalSold?: number;
    totalRevenue: number;
}
