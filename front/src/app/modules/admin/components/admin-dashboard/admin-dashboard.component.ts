import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  kpis$!: Observable<any>;
  error: string | null = null;

  // Sales Chart
  public lineChartData: ChartData<'line'> = {
    datasets: [],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: true },
    }
  };

  // Category Chart
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  public pieChartType: ChartType = 'pie';

  // Person Type Chart (DWH)
  public personTypeChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.error = null;
    this.kpis$ = this.dashboardService.getKpis().pipe(
      catchError(err => {
        this.error = `Erreur API: ${err.message || 'Serveur injoignable'}. Vérifiez que le backend .NET est bien lancé.`;
        console.error('KPI Error:', err);
        // Fallback pour ne pas tout masquer si possible
        return of({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCategories: 0 });
      })
    );

    this.dashboardService.getMonthlySales().subscribe({
      next: (data) => {
        this.lineChartData = {
          labels: data.map(d => d.label),
          datasets: [
            {
              data: data.map(d => d.value),
              label: 'Ventes Mensuelles ($)',
              fill: true,
              tension: 0.5,
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.2)'
            }
          ]
        };
      },
      error: (err) => console.error('Sales chart error:', err)
    });

    this.dashboardService.getCategorySales().subscribe(data => {
      this.pieChartData = {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value)
        }]
      };
    });

    this.dashboardService.getPersonDistribution().subscribe(data => {
      this.personTypeChartData = {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
        }]
      };
    });
  }
}
