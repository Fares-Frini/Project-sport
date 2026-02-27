import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KpiCardsComponent } from './components/kpi-cards/kpi-cards.component';
import { SalesChartsComponent } from './components/sales-charts/sales-charts.component';
import { TopProductsTableComponent } from './components/top-products-table/top-products-table.component';
import { DwhDashboardComponent } from './components/dwh-dashboard/dwh-dashboard.component';


@NgModule({
  declarations: [
    DashboardComponent,
    KpiCardsComponent,
    SalesChartsComponent,
    TopProductsTableComponent,
    DwhDashboardComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    SharedModule,
    NgChartsModule
  ]
})
export class AnalyticsModule { }
