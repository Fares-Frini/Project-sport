import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GlobalKPIs, CategorySales, SalesTrend } from '../../../core/models/analytics.models';

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

    // ─── DWH Analytics endpoints ──────────────────────────────────────────
    /** Top 20 persons sample from DimPerson */
    getPersons(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/persons`);
    }

    /** Count per PersonType from DimPerson */
    getPersonsByType(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/persons-by-type`);
    }

    /** Total customers in DimCustomer */
    getCustomerCount(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/customers-count`);
    }

    /** Top N products by revenue from Fact_Sales JOIN Dim_Product */
    getTopProducts(limit: number = 10): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/top-products?limit=${limit}`);
    }

    /** Revenue grouped by sales territory from Fact_Sales JOIN Dim_SalesTerritory */
    getSalesByTerritory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/sales-by-territory`);
    }

    /** Top N salespeople by revenue from Fact_Sales JOIN Dim_SalesPerson */
    getTopSalesPersons(limit: number = 10): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/top-salespersons?limit=${limit}`);
    }

    /** Credit card type distribution from Dim_CreditCard */
    getCreditCardsByType(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/credit-cards-by-type`);
    }
}
