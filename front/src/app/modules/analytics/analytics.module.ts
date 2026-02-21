import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KpiCardsComponent } from './components/kpi-cards/kpi-cards.component';
import { SalesChartsComponent } from './components/sales-charts/sales-charts.component';
import { TopProductsTableComponent } from './components/top-products-table/top-products-table.component';


@NgModule({
  declarations: [
    DashboardComponent,
    KpiCardsComponent,
    SalesChartsComponent,
    TopProductsTableComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    SharedModule
  ]
})
export class AnalyticsModule { }
