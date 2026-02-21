import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { CategoryDetailComponent } from './components/categories/category-detail/category-detail.component';
import { SubcategoryListComponent } from './components/subcategories/subcategory-list/subcategory-list.component';
import { SubcategoryFormComponent } from './components/subcategories/subcategory-form/subcategory-form.component';
import { SubcategoryDetailComponent } from './components/subcategories/subcategory-detail/subcategory-detail.component';
import { roleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  // Categories
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/create', component: CategoryFormComponent, canActivate: [roleGuard], data: { role: 'Admin' } },
  { path: 'categories/:id', component: CategoryDetailComponent },
  { path: 'categories/:id/edit', component: CategoryFormComponent, canActivate: [roleGuard], data: { role: 'Admin' } },

  // Subcategories
  { path: 'subcategories', component: SubcategoryListComponent },
  { path: 'subcategories/create', component: SubcategoryFormComponent, canActivate: [roleGuard], data: { role: 'Admin' } },
  { path: 'subcategories/:id', component: SubcategoryDetailComponent },
  { path: 'subcategories/:id/edit', component: SubcategoryFormComponent, canActivate: [roleGuard], data: { role: 'Admin' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OltpRoutingModule { }
