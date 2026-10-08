import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { orderBadgeBase, orderStatusClass, orderStatusLabel } from './order-status';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    EmptyStateComponent
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  orders: Order[] = [];
  loaded = false;

  readonly statusLabel = orderStatusLabel;
  readonly statusClass = (s: string) => `${orderBadgeBase} ${orderStatusClass(s)}`;

  ngOnInit(): void {
    this.orderService.getOrdersForUser().subscribe({
      next: orders => {
        this.orders = orders;
        this.loaded = true;
      },
      error: () => this.loaded = true
    })
  }

  goToShop() {
    this.router.navigateByUrl('/shop');
  }
}
