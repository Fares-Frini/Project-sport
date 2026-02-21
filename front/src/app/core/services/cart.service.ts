import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, Cart, CartSummary } from '../models/cart.models';
import { Product } from '../models/product.models';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly STORAGE_KEY = 'sportstore_cart';
    private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
    public cartItems$ = this.cartItemsSubject.asObservable();

    public cart$: Observable<Cart>;
    public cartSummary$: Observable<CartSummary>;

    constructor() {
        this.cart$ = this.cartItems$.pipe(
            map(items => this.calculateCart(items))
        );

        this.cartSummary$ = this.cart$.pipe(
            map(cart => ({
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
                total: cart.total
            }))
        );

        this.cartItems$.subscribe(items => this.saveToStorage(items));
    }

    addProduct(product: Product, quantity: number = 1): void {
        const current = this.cartItemsSubject.value;
        const existingIndex = current.findIndex(item => item.productId === product.id);

        if (existingIndex >= 0) {
            current[existingIndex].quantity += quantity;
            current[existingIndex].totalPrice = current[existingIndex].quantity * current[existingIndex].unitPrice;
        } else {
            const unitPrice = product.price; // Simplification, handle discounts later
            const newItem: CartItem = {
                productId: product.id,
                product: product,
                quantity: quantity,
                unitPrice: unitPrice,
                totalPrice: unitPrice * quantity
            };
            current.push(newItem);
        }

        this.cartItemsSubject.next([...current]);
    }

    updateQuantity(productId: number, quantity: number): void {
        if (quantity <= 0) {
            this.removeProduct(productId);
            return;
        }

        const current = this.cartItemsSubject.value;
        const index = current.findIndex(item => item.productId === productId);

        if (index >= 0) {
            current[index].quantity = quantity;
            current[index].totalPrice = current[index].quantity * current[index].unitPrice;
            this.cartItemsSubject.next([...current]);
        }
    }

    removeProduct(productId: number): void {
        const current = this.cartItemsSubject.value;
        const filtered = current.filter(item => item.productId !== productId);
        this.cartItemsSubject.next(filtered);
    }

    clearCart(): void {
        this.cartItemsSubject.next([]);
    }

    private calculateCart(items: CartItem[]): Cart {
        const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

        return {
            items: items,
            subTotal: total,
            discountTotal: 0,
            total: total
        };
    }

    private loadFromStorage(): CartItem[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    private saveToStorage(items: CartItem[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier:', error);
        }
    }
}
