import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OltpRoutingModule } from './oltp-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { CategoryDetailComponent } from './components/categories/category-detail/category-detail.component';
import { SubcategoryListComponent } from './components/subcategories/subcategory-list/subcategory-list.component';
import { SubcategoryFormComponent } from './components/subcategories/subcategory-form/subcategory-form.component';
import { SubcategoryDetailComponent } from './components/subcategories/subcategory-detail/subcategory-detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent,
    CategoryDetailComponent,
    SubcategoryListComponent,
    SubcategoryFormComponent,
    SubcategoryDetailComponent
  ],
  imports: [
    CommonModule,
    OltpRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class OltpModule { }
