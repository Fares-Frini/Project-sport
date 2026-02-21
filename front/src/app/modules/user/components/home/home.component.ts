import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../../core/models/product.models';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts$!: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.featuredProducts$ = this.productService.getFeatured();
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product, 1);
  }

  viewArticle(productId: number): void {
    this.router.navigate(['/catalog'], { queryParams: { id: productId } });
  }

  viewCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
