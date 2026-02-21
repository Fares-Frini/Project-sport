import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { GlobalKPIs, ProductSales } from '../../../../core/models/analytics.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  kpis: GlobalKPIs | null = null;
  topProducts: ProductSales[] = [];

  salesByCategoryData: any;
  salesByCityData: any;
  salesTrendData: any;
  salesByCountryData: any;

  isLoading = false;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    forkJoin({
      kpis: this.analyticsService.getGlobalKPIs(),
      byCategory: this.analyticsService.getSalesByCategory(),
      byCity: this.analyticsService.getSalesByCity(),
      trend: this.analyticsService.getSalesTrend(),
      byCountry: this.analyticsService.getSalesByCountry(),
      topProducts: this.analyticsService.getTopProducts()
    }).subscribe({
      next: (data) => {
        this.kpis = data.kpis;
        this.topProducts = data.topProducts;

        // Chart 1: Sales by Category (Vertical Bar)
        this.salesByCategoryData = {
          labels: data.byCategory.map(c => c.categoryName),
          datasets: [{
            label: 'Chiffre d\'Affaires',
            data: data.byCategory.map(c => c.totalRevenue),
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
            borderWidth: 1
          }]
        };

        // Chart 2: Top Cities (Horizontal Bar)
        // Taking top 10 for chart
        const topCities = data.byCity.slice(0, 10);
        this.salesByCityData = {
          labels: topCities.map(c => c.city),
          datasets: [{
            label: 'Chiffre d\'Affaires',
            data: topCities.map(c => c.totalRevenue),
            backgroundColor: '#36b9cc'
          }]
        };

        // Chart 3: Trends (Line)
        this.salesTrendData = {
          labels: data.trend.map(t => t.date), // Assuming date string 'YYYY-MM'
          datasets: [
            {
              label: 'Chiffre d\'Affaires',
              data: data.trend.map(t => t.revenue),
              borderColor: '#4e73df',
              backgroundColor: 'rgba(78, 115, 223, 0.05)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Commandes',
              data: data.trend.map(t => t.orders),
              borderColor: '#1cc88a',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.3,
              yAxisID: 'y1'
            }
          ]
        };

        // Chart 4: Country (Doughnut)
        this.salesByCountryData = {
          labels: data.byCountry.map(c => c.country),
          datasets: [{
            data: data.byCountry.map(c => c.totalRevenue),
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
          }]
        };

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  get trendOptions() {
    return {
      scales: {
        y: {
          beginAtZero: true,
          position: 'left',
          title: { display: true, text: 'Revenu ($)' }
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Commandes' }
        }
      }
    };
  }
}
