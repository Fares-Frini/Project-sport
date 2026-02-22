import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../../../core/models/cart.models';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  standalone: false // Forced refresh for IDE
})
export class ShoppingCartComponent implements OnInit {
  cart$!: Observable<Cart>;
  orderConfirmed = false;
  orderRef = '';
  orderDate = '';

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeProduct(productId: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cet article du panier ?')) {
      this.cartService.removeProduct(productId);
    }
  }

  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      this.cartService.clearCart();
    }
  }

  confirmOrder(total: number): void {
    // Generate static order reference
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.orderRef = `CMD-${new Date().getFullYear()}-${rand}`;
    this.orderDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    this.orderConfirmed = true;
    // Clear the cart
    this.cartService.clearCart();
  }
}
