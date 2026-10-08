import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe, Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { StripeService } from '../../../core/services/stripe.service';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    CurrencyPipe,
    FormsModule,
    MatIcon
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  cartService = inject(CartService);
  private stripeService = inject(StripeService);
  location = inject(Location);
  code?: string;

  applyCouponCode() {
    if (!this.code) return;
    this.cartService.applyDiscount(this.code).subscribe({
      next: async coupon => {
        const cart = this.cartService.cart();
        if (cart) {
          cart.coupon = coupon;
          await firstValueFrom(this.cartService.setCart(cart));
          this.code = undefined;
          if (this.location.path() === '/checkout') {
            await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
          }
        }
      }
    });
  }

  async removeCouponCode() {
    const cart = this.cartService.cart();
    if (!cart) return;
    if (cart.coupon) cart.coupon = undefined;
    await firstValueFrom(this.cartService.setCart(cart));
    if (this.location.path() === '/checkout') {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
  }
}