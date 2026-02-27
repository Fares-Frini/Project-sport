import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GlobalKPIs, CategorySales, SalesTrend, DwhKPIs, CategoryRevenue, MonthlySalesTrend, ProductPerformance, SalesPersonPerformance, CustomerSegment, CitySales, CountrySales, ProductSales } from '../../../core/models/analytics.models';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private apiUrl = `${environment.apiUrl}/analytics`;
    private dashboardUrl = `${environment.apiUrl}/Dashboard`;

    constructor(private http: HttpClient) { }

    // ─── OLTP Dashboard endpoints ──────────────────────────────────────────
    getGlobalKPIs(): Observable<GlobalKPIs> {
        return this.http.get<GlobalKPIs>(`${this.dashboardUrl}/kpis`);
    }

    getSalesByCategory(): Observable<CategorySales[]> {
        return this.http.get<CategorySales[]>(`${this.dashboardUrl}/category-sales`);
    }

    getSalesTrend(): Observable<SalesTrend[]> {
        return this.http.get<SalesTrend[]>(`${this.dashboardUrl}/monthly-sales`);
    }

    // ─── Legacy/Compatibility endpoints ───────────────────────────────────
    getSalesByCity(): Observable<CitySales[]> {
        return this.http.get<CitySales[]>(`${this.apiUrl}/sales-by-city`);
    }

    getSalesByCountry(): Observable<CountrySales[]> {
        return this.http.get<CountrySales[]>(`${this.apiUrl}/sales-by-country`);
    }

    getTopProducts(limit: number = 10): Observable<ProductSales[]> {
        return this.http.get<ProductSales[]>(`${this.apiUrl}/top-products?limit=${limit}`);
    }

    getPersonsByType(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/persons-by-type`);
    }

    getPersons(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/persons`);
    }

    getSalesByTerritory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/sales-by-territory`);
    }


    // ─── New DWH Dashboard Endpoints ──────────────────────────────────────────

    getDwhKPIs(): Observable<DwhKPIs> {
        return this.http.get<DwhKPIs>(`${this.apiUrl}/dwh/kpis`);
    }

    getDwhSalesByCategory(): Observable<CategoryRevenue[]> {
        return this.http.get<CategoryRevenue[]>(`${this.apiUrl}/dwh/sales-by-category`);
    }

    getDwhMonthlySalesTrend(): Observable<MonthlySalesTrend[]> {
        return this.http.get<MonthlySalesTrend[]>(`${this.apiUrl}/dwh/monthly-sales-trend`);
    }

    getDwhTopProductsPerformance(): Observable<ProductPerformance[]> {
        return this.http.get<ProductPerformance[]>(`${this.apiUrl}/dwh/top-products-performance`);
    }

    getDwhSalesPersonPerformance(): Observable<SalesPersonPerformance[]> {
        return this.http.get<SalesPersonPerformance[]>(`${this.apiUrl}/dwh/salesperson-performance`);
    }

    getDwhCustomerSegmentation(): Observable<CustomerSegment[]> {
        return this.http.get<CustomerSegment[]>(`${this.apiUrl}/dwh/customer-segmentation`);
    }
}
