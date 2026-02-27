import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../../../../core/services/order.service';

@Component({
    selector: 'app-order-management',
    templateUrl: './order-management.component.html',
    styleUrls: ['./order-management.component.scss'],
    standalone: false
})
export class OrderManagementComponent implements OnInit {
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    loading = true;
    currentStatusFilter = '';
    currentSearchTerm = '';
    startDate: Date | null = null;
    endDate: Date | null = null;

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        this.loadAllOrders();
    }

    loadAllOrders(): void {
        this.loading = true;
        this.orderService.getAllOrders().subscribe({
            next: (orders) => {
                this.orders = orders;
                this.applyFilters();
                this.loading = false;
            },
            error: (err) => {
                console.error('Erreur lors du chargement des commandes:', err);
                this.loading = false;
            }
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.currentSearchTerm = filterValue.trim().toLowerCase();
        this.applyFilters();
    }

    filterByStatus(status: string): void {
        this.currentStatusFilter = status;
        this.applyFilters();
    }

    applyFilters(): void {
        this.filteredOrders = this.orders.filter(order => {
            const matchesStatus = this.currentStatusFilter === '' || order.status === this.currentStatusFilter;
            const matchesSearch = this.currentSearchTerm === '' ||
                order.id.toString().includes(this.currentSearchTerm) ||
                order.customerName.toLowerCase().includes(this.currentSearchTerm);

            const orderDate = new Date(order.orderDate);
            orderDate.setHours(0, 0, 0, 0);

            let matchesDate = true;
            if (this.startDate) {
                const start = new Date(this.startDate);
                start.setHours(0, 0, 0, 0);
                matchesDate = matchesDate && orderDate >= start;
            }
            if (this.endDate) {
                const end = new Date(this.endDate);
                end.setHours(0, 0, 0, 0);
                matchesDate = matchesDate && orderDate <= end;
            }

            return matchesStatus && matchesSearch && matchesDate;
        });
    }

    onDateChange(): void {
        this.applyFilters();
    }

    clearDateRange(): void {
        this.startDate = null;
        this.endDate = null;
        this.applyFilters();
    }

    updateStatus(orderId: number, status: string): void {
        if (confirm(`Changer le statut de la commande #${orderId} en "${status}" ?`)) {
            this.orderService.updateOrderStatus(orderId, status).subscribe({
                next: () => {
                    this.loadAllOrders(); // Refresh list
                },
                error: (err) => {
                    console.error('Erreur lors de la mise à jour du statut:', err);
                    alert('Erreur lors de la mise à jour du statut.');
                }
            });
        }
    }

    viewDetails(order: Order): void {
        // For now we just show an alert or could implement a modal
        const items = order.orderDetails.map(od => `- ${od.productName} (x${od.quantity})`).join('\n');
        alert(`Détails Commande #${order.id}\nClient: ${order.customerName}\nTotal: ${order.totalAmount}€\n\nProduits:\n${items}`);
    }
}
