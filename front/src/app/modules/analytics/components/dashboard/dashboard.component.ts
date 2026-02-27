import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  kpis: any = null;
  salesByCategoryData: any;
  salesByCityData: any; // Subcategory counts
  salesTrendData: any; // Status
  topSellingProductsData: any; // Quantity Sold
  salesByCountryData: any; // Price Distribution

  isLoading = false;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private tryGetLabel(obj: any): string {
    return obj?.label || obj?.Label || obj?.productName || obj?.categoryName || 'Inconnu';
  }

  private tryGetValue(obj: any): number {
    const val = obj?.value ?? obj?.Value ?? obj?.quantitySold ?? obj?.count ?? 0;
    return Number(val);
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      kpis: this.dashboardService.getKpis().pipe(catchError(() => of(null))),
      byCategory: this.dashboardService.getCategorySales().pipe(catchError(() => of([]))),
      bySubCategory: this.dashboardService.getProductsBySubCategory().pipe(catchError(() => of([]))),
      status: this.dashboardService.getStatusDistribution().pipe(catchError(() => of([]))),
      price: this.dashboardService.getPriceDistribution().pipe(catchError(() => of([]))),
      topSelling: this.dashboardService.getTopProductsOltp().pipe(catchError(() => of([])))
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data: any) => {
        this.kpis = data.kpis;

        if (data.byCategory?.length) {
          this.salesByCategoryData = {
            labels: data.byCategory.map((c: any) => this.tryGetLabel(c)),
            datasets: [{
              data: data.byCategory.map((c: any) => this.tryGetValue(c)),
              backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796']
            }]
          };
        } else { this.salesByCategoryData = null; }

        if (data.bySubCategory?.length) {
          this.salesByCityData = {
            labels: data.bySubCategory.map((c: any) => this.tryGetLabel(c)),
            datasets: [{
              label: 'Nombre de Produits',
              data: data.bySubCategory.map((c: any) => this.tryGetValue(c)),
              backgroundColor: '#4e73df'
            }]
          };
        } else { this.salesByCityData = null; }

        if (data.status?.length) {
          this.salesTrendData = {
            labels: data.status.map((t: any) => this.tryGetLabel(t)),
            datasets: [{
              label: 'Commandes',
              data: data.status.map((t: any) => this.tryGetValue(t)),
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            }]
          };
        } else { this.salesTrendData = null; }

        if (data.price?.length) {
          this.salesByCountryData = {
            labels: data.price.map((c: any) => this.tryGetLabel(c)),
            datasets: [{
              data: data.price.map((c: any) => this.tryGetValue(c)),
              backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b']
            }]
          };
        } else { this.salesByCountryData = null; }

        if (data.topSelling?.length) {
          this.topSellingProductsData = {
            labels: data.topSelling.map((p: any) => this.tryGetLabel(p)),
            datasets: [{
              label: 'Quantité vendue',
              data: data.topSelling.map((p: any) => this.tryGetValue(p)),
              backgroundColor: '#f6c23e',
              borderRadius: 5
            }]
          };
        } else { this.topSellingProductsData = null; }
      }
    });
  }
}
