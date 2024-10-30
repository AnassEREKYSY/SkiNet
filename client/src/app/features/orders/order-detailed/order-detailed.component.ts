import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Order } from '../../../shared/models/order';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AccountService } from '../../../core/services/account.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-order-detailed',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    AddressPipe,
    PaymentCardPipe,
    DatePipe,
    CurrencyPipe,
    RouterModule
  ],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit{
  private orderService = inject(OrderService);
  private activatedRoute =  inject(ActivatedRoute);
  private accountService = inject(AccountService)
  order?: Order
  private router= inject(Router);
  private adminService= inject(AdminService);
  buttonText= this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders'

  ngOnInit(): void {
    this.loadOrder();
  }

  onReturnClick(){
    this.accountService.isAdmin() 
    ? this.router.navigateByUrl('/admin')
    : this.router.navigateByUrl('/orders');
  }

  loadOrder(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return ;
    const loadOrderData= this.accountService.isAdmin()
      ? this.adminService.getOrder(+id):
        this.orderService.getOrderDetailed(+id);

    loadOrderData.subscribe({
      next: order=> this.order=order
    })
  }
}
