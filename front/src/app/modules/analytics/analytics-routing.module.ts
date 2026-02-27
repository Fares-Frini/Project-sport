import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DwhDashboardComponent } from './components/dwh-dashboard/dwh-dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dwh', component: DwhDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
