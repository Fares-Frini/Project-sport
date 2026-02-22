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

    getPersonDistribution(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/analytics/persons-by-type`).pipe(
            tap((data: any[]) => console.log('DashboardService: Person Distribution reçue:', data))
        );
    }

    getTopProducts(limit: number): Observable<{ label: string; value: number }[]> {
        return this.http.get<{ label: string; value: number }[]>(
            `${environment.apiUrl}/analytics/top-products?limit=${limit}`
        );
    }

    getSalesByTerritory(): Observable<{ label: string; value: number }[]> {
        return this.http.get<{ label: string; value: number }[]>(
            `${environment.apiUrl}/analytics/sales-by-territory`
        );
    }

    getTopSalesPersons(limit: number): Observable<{ label: string; value: number }[]> {
        return this.http.get<{ label: string; value: number }[]>(
            `${environment.apiUrl}/analytics/top-salespersons?limit=${limit}`
        );
    }

    getCreditCardsByType(): Observable<{ label: string; value: number }[]> {
        return this.http.get<{ label: string; value: number }[]>(
            `${environment.apiUrl}/analytics/credit-cards-by-type`
        );
    }
}
