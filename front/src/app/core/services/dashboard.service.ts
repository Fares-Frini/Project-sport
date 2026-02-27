import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardKpi {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    totalCategories: number;
    totalUsers: number;
    avgDiscount?: number;
}
//Récupère les statistiques et données pour les graphiques du tableau de bord.
export interface MonthlySales {
    month: string;
    revenue: number;
    orderCount: number;
}

export interface CategorySales {
    categoryName: string;
    revenue: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getKpis(): Observable<DashboardKpi> {
        return this.http.get<DashboardKpi>(`${this.apiUrl}/kpis`).pipe(
            tap((data: DashboardKpi) => console.log('DashboardService: KPIs reçus:', data))
        );
    }

    getMonthlySales(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/monthly-sales`).pipe(
            tap((data: any[]) => console.log('DashboardService: Monthly Sales reçus:', data))
        );
    }

    getCategorySales(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/category-sales`).pipe(
            tap((data: any[]) => console.log('DashboardService: Category Sales reçus:', data))
        );
    }

    getSubCategorySales(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/subcategory-sales`).pipe(
            tap((data: any[]) => console.log('DashboardService: SubCategory Sales reçus:', data))
        );
    }

    getPersonDistribution(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/analytics/persons-by-type`).pipe(
            tap((data: any[]) => console.log('DashboardService: Person Distribution reçue:', data))
        );
    }

    getPersons(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/analytics/persons`).pipe(
            tap((data: any[]) => console.log('DashboardService: Persons sample reçue:', data))
        );
    }

    getTopProducts(limit = 10): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/analytics/top-products?limit=${limit}`);
    }

    getSalesByTerritory(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/analytics/sales-by-territory`);
    }

    getTopSalesPersons(limit = 10): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/analytics/top-salespersons?limit=${limit}`);
    }

    getCreditCardsByType(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/analytics/credit-cards-by-type`);
    }


    getUserGrowth(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/user-growth`).pipe(
            tap((data: any[]) => console.log('DashboardService: User Growth reçu:', data))
        );
    }

    getProductsBySubCategory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products-by-subcategory`);
    }

    getStockBySubCategory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/stock-by-subcategory`);
    }

    getPriceDistribution(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/price-distribution`);
    }

    getTopProductsOltp(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/top-products-oltp`);
    }

    getRecentOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/recent-orders`);
    }

    getStatusDistribution(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/status-distribution`);
    }

    getUserDistribution(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/user-distribution`);
    }
}




