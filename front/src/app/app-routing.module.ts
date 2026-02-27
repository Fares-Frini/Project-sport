import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'oltp',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/oltp/oltp.module').then(m => m.OltpModule)
      },
      {
        path: 'analytics',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/analytics/analytics.module').then(m => m.AnalyticsModule)
      },
      {
        path: '',
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
