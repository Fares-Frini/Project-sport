import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../../../../core/services/order.service';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    standalone: false
})
export class OrderHistoryComponent implements OnInit {
    orders: Order[] = [];
    loading = true;

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.loading = true;
        this.orderService.getMyOrders().subscribe({
            next: (orders) => {
                this.orders = orders;
                this.loading = false;
            },
            error: (err) => {
                console.error('Erreur lors du chargement des commandes:', err);
                this.loading = false;
            }
        });
    }
}
