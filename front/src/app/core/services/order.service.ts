import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Order {
    id: number;
    appUserId: number;
    customerName: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    orderDetails: OrderDetail[];
}

export interface OrderDetail {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getMyOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
    }

    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    updateOrderStatus(id: number, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/status`, `"${status}"`, {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
