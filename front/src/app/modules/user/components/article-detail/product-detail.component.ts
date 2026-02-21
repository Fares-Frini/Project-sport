import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../core/models/product.models';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: false // Forced refresh for IDE
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.productService.getById(id).subscribe(product => {
      this.product = product;
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addProduct(this.product, this.quantity);
      alert('Produit ajouté au panier !');
    }
  }

  increment(): void { this.quantity++; }
  decrement(): void { if (this.quantity > 1) this.quantity--; }
}
