import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    GlobalKPIs,
    CategorySales,
    CitySales,
    CountrySales,
    SalesTrend,
    ProductSales
} from '../../../core/models/analytics.models';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private apiUrl = `${environment.apiUrl}/analytics`;

    constructor(private http: HttpClient) { }

    getGlobalKPIs(): Observable<GlobalKPIs> {
        // Mock Data
        return new BehaviorSubject<GlobalKPIs>({
            totalRevenue: 154320,
            revenueGrowth: 12.5,
            totalOrders: 1250,
            ordersGrowth: 5.2,
            averageBasket: 123.45,
            basketGrowth: -1.2,
            totalCustomers: 3420,
            customersGrowth: 8.7
        }).asObservable();
        // return this.http.get<GlobalKPIs>(`${this.apiUrl}/kpis`);
    }

    getSalesByCategory(): Observable<CategorySales[]> {
        return new BehaviorSubject<CategorySales[]>([
            { categoryId: 1, categoryName: 'Cosmétique', totalRevenue: 45000, percentage: 30 },
            { categoryId: 2, categoryName: 'Compléments', totalRevenue: 35000, percentage: 23 },
            { categoryId: 3, categoryName: 'Hygiène', totalRevenue: 25000, percentage: 17 },
            { categoryId: 4, categoryName: 'Maternité', totalRevenue: 20000, percentage: 13 },
            { categoryId: 5, categoryName: 'Bio', totalRevenue: 15000, percentage: 10 },
            { categoryId: 6, categoryName: 'Autre', totalRevenue: 14320, percentage: 7 }
        ]).asObservable();
    }

    getSalesBySubCategory(categoryId?: number): Observable<any[]> {
        return new BehaviorSubject<any[]>([]).asObservable();
    }

    getSalesByCity(): Observable<CitySales[]> {
        return new BehaviorSubject<CitySales[]>([
            { city: 'Paris', totalRevenue: 65000 },
            { city: 'Lyon', totalRevenue: 45000 },
            { city: 'Marseille', totalRevenue: 35000 },
            { city: 'Bordeaux', totalRevenue: 25000 },
            { city: 'Lille', totalRevenue: 20000 }
        ]).asObservable();
    }

    getSalesByCountry(): Observable<CountrySales[]> {
        return new BehaviorSubject<CountrySales[]>([
            { country: 'France', totalRevenue: 120000, percentage: 80 },
            { country: 'Belgique', totalRevenue: 20000, percentage: 13 },
            { country: 'Suisse', totalRevenue: 10000, percentage: 7 }
        ]).asObservable();
    }

    getSalesTrend(startDate?: string, endDate?: string): Observable<SalesTrend[]> {
        return new BehaviorSubject<SalesTrend[]>([
            { date: '2023-01', revenue: 10000, orders: 80 },
            { date: '2023-02', revenue: 12000, orders: 95 },
            { date: '2023-03', revenue: 11000, orders: 90 },
            { date: '2023-04', revenue: 14000, orders: 110 },
            { date: '2023-05', revenue: 16000, orders: 130 },
            { date: '2023-06', revenue: 15500, orders: 125 }
        ]).asObservable();
    }

    getTopProducts(limit: number = 10): Observable<ProductSales[]> {
        return new BehaviorSubject<ProductSales[]>([
            { productId: 1, productName: 'Crème Hydratante', categoryName: 'Cosmétique', quantitySold: 500, totalRevenue: 12500 },
            { productId: 2, productName: 'Vitamine C', categoryName: 'Compléments', quantitySold: 450, totalRevenue: 9000 },
            { productId: 3, productName: 'Shampoing Bio', categoryName: 'Hygiène', quantitySold: 400, totalRevenue: 6000 },
            { productId: 4, productName: 'Lait Bébé', categoryName: 'Maternité', quantitySold: 350, totalRevenue: 7000 },
            { productId: 5, productName: 'Huile Essentielle', categoryName: 'Bio', quantitySold: 300, totalRevenue: 4500 }
        ]).asObservable();
    }
}
