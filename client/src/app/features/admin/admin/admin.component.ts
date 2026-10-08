import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import { AdminService } from '../../../core/services/admin.service';
import { OrderParams } from '../../../shared/models/orderParams';
import { Order } from '../../../shared/models/order';
import { DialogService } from '../../../core/services/dialog.service';
import { orderBadgeBase, orderStatusClass, orderStatusLabel } from '../../orders/order-status';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconButton,
    MatIconAnchor,
    MatIcon,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    MatLabel,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
  dataSource = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService)
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];
  readonly statusLabel = orderStatusLabel;
  readonly statusClass = (s: string) => `${orderBadgeBase} ${orderStatusClass(s)}`;

  ngOnInit(): void {
    this.loadOrders();
  }


  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        if (response.data) {
          this.dataSource.data = response.data;
          this.totalItems = response.count;
        }
      }
    })
  }

  onPageChange(event:PageEvent){
    this.orderParams.pageNumber =  event.pageIndex+1;
    this.orderParams.pageSize=event.pageSize;
    this.loadOrders();
  }

  onFilterSelect(event: MatSelectChange){
    this.orderParams.filter= event.value;
    this.orderParams.pageNumber=1;
    this.loadOrders();
  }

  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: order => {
        this.dataSource.data = this.dataSource.data.map(o => o.id === id ? order : o)
      }
    })
  }

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure you want to issue this refund? This cannot be undone'
    )

    if (confirmed) this.refundOrder(id);
  }

}
