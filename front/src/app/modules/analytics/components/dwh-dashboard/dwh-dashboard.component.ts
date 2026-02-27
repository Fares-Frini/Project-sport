import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { DwhKPIs, CategoryRevenue, MonthlySalesTrend, ProductPerformance, SalesPersonPerformance, CustomerSegment, GlobalKPIs } from '../../../../core/models/analytics.models';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dwh-dashboard',
    templateUrl: './dwh-dashboard.component.html',
    styleUrls: ['./dwh-dashboard.component.scss']
})
export class DwhDashboardComponent implements OnInit {
    kpis: DwhKPIs | null = null;
    topProducts: ProductPerformance[] = [];
    salesPeople: SalesPersonPerformance[] = [];

    salesByCategoryData: any;
    salesTrendData: any;
    segmentationData: any;
    salesPersonData: any;

    isLoading = false;

    constructor(private analyticsService: AnalyticsService) { }

    ngOnInit(): void {
        this.loadDwhData();
    }

    loadDwhData(): void {
        this.isLoading = true;
        forkJoin({
            kpis: this.analyticsService.getDwhKPIs(),
            byCategory: this.analyticsService.getDwhSalesByCategory(),
            trend: this.analyticsService.getDwhMonthlySalesTrend(),
            topProducts: this.analyticsService.getDwhTopProductsPerformance(),
            salesPerson: this.analyticsService.getDwhSalesPersonPerformance(),
            segmentation: this.analyticsService.getDwhCustomerSegmentation()
        }).subscribe({
            next: (data) => {
                this.kpis = data.kpis;
                this.topProducts = data.topProducts;
                this.salesPeople = data.salesPerson;

                // Chart 1: CA par Catégorie (Bar)
                this.salesByCategoryData = {
                    labels: data.byCategory.map(c => c.category),
                    datasets: [{
                        label: 'Chiffre d\'Affaires ($)',
                        data: data.byCategory.map(c => c.revenue),
                        backgroundColor: '#4e73df',
                        borderRadius: 5
                    }]
                };

                // Chart 2: Évolution CA mensuel (Line)
                this.salesTrendData = {
                    labels: data.trend.map(t => t.monthLabel),
                    datasets: [{
                        label: 'Revenu Mensuel',
                        data: data.trend.map(t => t.revenue),
                        borderColor: '#1cc88a',
                        backgroundColor: 'rgba(28, 200, 138, 0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                };

                // Chart 3: Segmentation Clients (Pie)
                this.segmentationData = {
                    labels: data.segmentation.map(s => s.segment),
                    datasets: [{
                        data: data.segmentation.map(s => s.count),
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
                    }]
                };

                // Chart 4: Performance Vendeurs (Horizontal Bar)
                this.salesPersonData = {
                    labels: data.salesPerson.map(s => s.fullName),
                    datasets: [
                        {
                            label: 'CA Réalisé',
                            data: data.salesPerson.map(s => s.revenue),
                            backgroundColor: '#4e73df'
                        },
                        {
                            label: 'Quota',
                            data: data.salesPerson.map(s => s.quota || 0),
                            backgroundColor: '#f6c23e'
                        }
                    ]
                };

                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading DWH data:', err);
                this.isLoading = false;
            }
        });
    }
}
