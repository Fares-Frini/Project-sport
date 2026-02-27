//Représente les indicateurs clés de performance globaux.
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
    totalProducts?: number;
    totalCategories?: number;
    topCategory?: string;
    topCity?: string;
}
//Représente les ventes par catégorie.
export interface CategorySales {
    categoryId?: number;
    categoryName: string;
    totalRevenue: number;
    totalQuantity?: number;
    percentage?: number;
    nbOrders?: number;
}
//Représente les ventes par ville.
export interface CitySales {
    city: string;
    stateProvince?: string;
    country?: string;
    totalRevenue: number;
    nbOrders?: number;
    nbCustomers?: number;
}
//Représente les ventes par pays.
export interface CountrySales {
    country: string;
    countryCode?: string;
    totalRevenue: number;
    percentage?: number;
    nbOrders?: number;
    nbCities?: number;
}
//Représente l'évolution des ventes.
export interface SalesTrend {
    date: string; // or Date
    revenue: number;
    orders: number;
    year?: number;
    month?: number;
    monthName?: string;
    quarter?: number;
}
//Représente les ventes par produit.
export interface ProductSales {
    productId?: number;
    productName: string;
    categoryName: string;
    subCategoryName?: string;
    quantitySold?: number;
    totalSold?: number;
    totalRevenue: number;
}

// DWH Dashboard Interfaces
export interface DwhKPIs {
    totalRevenue: number;
    totalOrders: number;
    averageBasket: number;
    totalCustomers: number;
}

export interface CategoryRevenue {
    category: string;
    revenue: number;
}

export interface MonthlySalesTrend {
    monthLabel: string;
    revenue: number;
}

export interface ProductPerformance {
    productName: string;
    revenue: number;
    averageDiscount: number;
    totalQty: number;
}

export interface SalesPersonPerformance {
    fullName: string;
    revenue: number;
    quota?: number;
    successRate: number;
}

export interface CustomerSegment {
    segment: string;
    count: number;
}
