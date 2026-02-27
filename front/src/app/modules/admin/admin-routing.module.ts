import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ArticleListComponent } from './components/articles/article-list/article-list.component';
import { ArticleFormComponent } from './components/articles/article-form/article-form.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { CategoryDetailComponent } from './components/categories/category-detail/category-detail.component';
import { SubcategoryListComponent } from './components/subcategories/subcategory-list/subcategory-list.component';
import { SubcategoryFormComponent } from './components/subcategories/subcategory-form/subcategory-form.component';
import { SubcategoryDetailComponent } from './components/subcategories/subcategory-detail/subcategory-detail.component';
import { roleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { role: 'Admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'articles', component: ArticleListComponent },
      { path: 'articles/create', component: ArticleFormComponent },
      { path: 'articles/:id/edit', component: ArticleFormComponent },
      { path: 'users', component: UserListComponent },
      { path: 'users/create', component: UserFormComponent },
      { path: 'users/:id/edit', component: UserFormComponent },
      { path: 'orders', component: OrderManagementComponent },
      // Categories
      { path: 'categories', component: CategoryListComponent },
      { path: 'categories/create', component: CategoryFormComponent },
      { path: 'categories/:id', component: CategoryDetailComponent },
      { path: 'categories/:id/edit', component: CategoryFormComponent },
      // Subcategories
      { path: 'subcategories', component: SubcategoryListComponent },
      { path: 'subcategories/create', component: SubcategoryFormComponent },
      { path: 'subcategories/:id', component: SubcategoryDetailComponent },
      { path: 'subcategories/:id/edit', component: SubcategoryFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
