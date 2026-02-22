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

  // ── OLTP Charts ────────────────────────────────────────────────────────
  public lineChartData: ChartData<'line'> = { datasets: [], labels: [] };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: true } }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899', '#14b8a6'] }]
  };

  // ── DWH Charts ─────────────────────────────────────────────────────────
  public personTypeChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [], datasets: [{ data: [], label: 'Personnes (DWH)', backgroundColor: '#3b82f6', borderRadius: 5 }]
  };

  public topProductsChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [], datasets: [{ data: [], label: 'Revenu ($)', backgroundColor: '#f97316', borderRadius: 5 }]
  };
  public topProductsOptions: ChartConfiguration['options'] = {
    responsive: true, indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } }
  };

  public territoryChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [], datasets: [{ data: [], label: 'Revenu par Territoire ($)', backgroundColor: '#10b981', borderRadius: 5 }]
  };

  public salesPersonChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [], datasets: [{ data: [], label: 'Revenu ($)', backgroundColor: '#8b5cf6', borderRadius: 5 }]
  };
  public salesPersonOptions: ChartConfiguration['options'] = {
    responsive: true, indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } }
  };

  public creditCardChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'] }]
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.error = null;

    this.kpis$ = this.dashboardService.getKpis().pipe(
      catchError(err => {
        this.error = `Erreur API: ${err.message || 'Serveur injoignable'}. Vérifiez que le backend .NET est bien lancé.`;
        return of({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCategories: 0 });
      })
    );

    // OLTP charts
    this.dashboardService.getMonthlySales().subscribe({
      next: (data) => {
        this.lineChartData = {
          labels: data.map(d => d.label),
          datasets: [{
            data: data.map(d => d.value),
            label: 'Ventes Mensuelles ($)',
            fill: true, tension: 0.5,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.2)'
          }]
        };
      },
      error: (err) => console.error('Sales chart error:', err)
    });

    this.dashboardService.getCategorySales().subscribe(data => {
      this.pieChartData = {
        labels: data.map(d => d.label),
        datasets: [{ data: data.map(d => d.value) }]
      };
    });

    // DWH charts
    this.dashboardService.getPersonDistribution().subscribe(data => {
      this.personTypeChartData = {
        labels: data.map(d => d.label),
        datasets: [{ data: data.map(d => d.value), label: 'Répartition Par Type (DWH)', backgroundColor: '#3b82f6', borderRadius: 5 }]
      };
    });

    this.dashboardService.getTopProducts(10).subscribe(data => {
      this.topProductsChartData = {
        labels: data.map(d => d.label),
        datasets: [{ data: data.map(d => d.value), label: 'Revenu ($)', backgroundColor: '#f97316', borderRadius: 5 }]
      };
    });

    this.dashboardService.getSalesByTerritory().subscribe(data => {
      this.territoryChartData = {
        labels: data.map(d => d.label),
        datasets: [{ data: data.map(d => d.value), label: 'Revenu par Territoire ($)', backgroundColor: '#10b981', borderRadius: 5 }]
      };
    });

    this.dashboardService.getTopSalesPersons(10).subscribe(data => {
      this.salesPersonChartData = {
        labels: data.map(d => d.label),
        datasets: [{ data: data.map(d => d.value), label: 'Revenu ($)', backgroundColor: '#8b5cf6', borderRadius: 5 }]
      };
    });

    this.dashboardService.getCreditCardsByType().subscribe(data => {
      this.creditCardChartData = {
        labels: data.map(d => d.label),
        datasets: [{ data: data.map(d => d.value), backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'] }]
      };
    });
  }
}

