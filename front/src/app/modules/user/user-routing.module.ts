import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductCatalogComponent } from './components/article-catalog/product-catalog.component';
import { ProductDetailComponent } from './components/article-detail/product-detail.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'catalog', component: ProductCatalogComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'my-orders', component: OrderHistoryComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
