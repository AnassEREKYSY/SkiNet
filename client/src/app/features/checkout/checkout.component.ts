import { Component, inject, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StripeAddressElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButton,
    RouterLink 
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private stripeService=inject(StripeService)
  private snack=inject(SnackbarService);
  addressElement?:StripeAddressElement;

  async ngOnInit() {
    try{
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement?.mount("#address-element")
    }catch(error: any){
      this.snack.error(error.message)
    }
  }
}
