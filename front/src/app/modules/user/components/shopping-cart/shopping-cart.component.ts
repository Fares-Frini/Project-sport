import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../../../core/models/cart.models';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

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
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    this.cartService.checkout().subscribe({
      next: (order) => {
        this.orderRef = `CMD-${order.id}`;
        this.orderDate = new Date(order.orderDate).toLocaleDateString('fr-FR', {
          day: '2-digit', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
        this.orderConfirmed = true;
        this.cartService.clearCart();
      },
      error: (err) => {
        console.error('Erreur lors de la commande:', err);
        alert('Une erreur est survenue lors de la validation de votre commande. Veuillez réessayer.');
      }
    });
  }
}
