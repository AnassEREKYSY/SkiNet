import { Component, inject, OnInit, signal } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { ShopParams } from '../../shared/models/shopParams';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from '../shop/product-item/product-item.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatAnchor, MatIcon, RouterLink, ProductItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private shopService = inject(ShopService);
  featured = signal<Product[]>([]);

  categories = [
    { type: 'Boards', label: 'Boards', image: '/images/products/sb-ang1.png' },
    { type: 'Boots', label: 'Boots', image: '/images/products/boot-ang1.png' },
    { type: 'Gloves', label: 'Gloves', image: '/images/products/glove-code1.png' },
    { type: 'Hats', label: 'Hats', image: '/images/products/hat-core1.png' },
  ];

  perks = [
    { icon: 'lock', title: 'Secure checkout', text: 'Card payments handled by Stripe, with 3-D Secure.' },
    { icon: 'receipt_long', title: 'Order history', text: 'Follow every order and its status from your account.' },
    { icon: 'sell', title: 'Coupon codes', text: 'Apply a code in your cart and see the discount right away.' },
  ];

  ngOnInit(): void {
    const params = new ShopParams();
    params.pageSize = 4;
    params.sort = 'priceDesc';
    this.shopService.getProducts(params).subscribe({
      next: (res) => this.featured.set(res.data),
    });
  }
}
