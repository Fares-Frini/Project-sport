import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  kpis$!: Observable<any>;
  error: string | null = null;

  // ── OLTP Charts & Data ──────────────────────────────────────────────────
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899', '#14b8a6'] }]
  };

  // ── DWH Charts ──────────────────────────────────────────────────────────
  public personTypeChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [], datasets: [{ data: [], label: 'Personnes (DWH)', backgroundColor: '#3b82f6', borderRadius: 5 }]
  };

  public topProductsChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [], datasets: [{ data: [], label: 'Revenu ($)', backgroundColor: '#f97316', borderRadius: 5 }]
  };

  public territoryChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [], datasets: [{ data: [], label: 'Revenu par Territoire ($)', backgroundColor: '#10b981', borderRadius: 5 }]
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.error = null;

    // 1. Fetch KPIs
    this.kpis$ = this.dashboardService.getKpis().pipe(
      catchError(err => {
        this.error = `Erreur API: ${err.message || 'Serveur injoignable'}.`;
        return of({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCategories: 0 });
      })
    );

    // 2. Category Sales
    this.dashboardService.getCategorySales().subscribe((data: any[]) => {
      this.pieChartData = {
        labels: data.map((d: any) => d.label || d.Label),
        datasets: [{ data: data.map((d: any) => d.value || d.Value), label: 'Ventes par Catégorie ($)' }]
      };
    });

    // 3. DWH - Person Distribution
    this.dashboardService.getPersonDistribution().subscribe((data: any[]) => {
      this.personTypeChartData = {
        labels: data.map((d: any) => d.label),
        datasets: [{ data: data.map((d: any) => d.value), label: 'Répartition Par Type (DWH)', backgroundColor: '#3b82f6', borderRadius: 5 }]
      };
    });

    // 4. DWH - Top Products
    this.dashboardService.getTopProducts(10).subscribe((data: any[]) => {
      this.topProductsChartData = {
        labels: data.map((d: any) => d.label),
        datasets: [{ data: data.map((d: any) => d.value), label: 'Revenu ($)', backgroundColor: '#f97316', borderRadius: 5 }]
      };
    });

    // 5. DWH - Sales by Territory
    this.dashboardService.getSalesByTerritory().subscribe((data: any[]) => {
      this.territoryChartData = {
        labels: data.map((d: any) => d.label),
        datasets: [{ data: data.map((d: any) => d.value), label: 'Revenu par Territoire ($)', backgroundColor: '#10b981', borderRadius: 5 }]
      };
    });
  }
}
