import { Product } from './product.models';

export interface CartItem {
    productId: number;
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Cart {
    items: CartItem[];
    subTotal: number;
    discountTotal: number;
    total: number;
}

export interface CartSummary {
    itemCount: number;
    total: number;
}
