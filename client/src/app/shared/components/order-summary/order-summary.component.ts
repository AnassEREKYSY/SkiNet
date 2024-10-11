import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe, Location } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    RouterLink,
    MatFormField,
    MatLabel,
    MatInput,
    CurrencyPipe
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  cartService=inject(CartService)
  location= inject(Location);

}
