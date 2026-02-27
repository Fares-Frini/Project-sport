import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ArticleListComponent } from './components/articles/article-list/article-list.component';
import { ArticleFormComponent } from './components/articles/article-form/article-form.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { CategoryDetailComponent } from './components/categories/category-detail/category-detail.component';
import { SubcategoryListComponent } from './components/subcategories/subcategory-list/subcategory-list.component';
import { SubcategoryFormComponent } from './components/subcategories/subcategory-form/subcategory-form.component';
import { SubcategoryDetailComponent } from './components/subcategories/subcategory-detail/subcategory-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ArticleFormComponent,
    UserListComponent,
    UserFormComponent,
    UserDetailComponent,
    OrderManagementComponent,
    CategoryListComponent,
    CategoryFormComponent,
    CategoryDetailComponent,
    SubcategoryListComponent,
    SubcategoryFormComponent,
    SubcategoryDetailComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    NgChartsModule,
    ArticleListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
