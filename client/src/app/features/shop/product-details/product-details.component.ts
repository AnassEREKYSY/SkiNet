import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  private shopService=inject(ShopService);
  private activatedRoute=inject(ActivatedRoute);
  private cartService= inject(CartService)
  product?:Product;
  quantityInCart=0;
  quantity=1;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    const id=this.activatedRoute.snapshot.paramMap.get('id');
    if(!id){
      return;
    }
    this.shopService.getProduct(+id).subscribe({
      next:product=> {
        this.product=product; 
        this.updateQuantityInCart();
      },
      error:error=>console.log(error)
    })
  }

  updateQuantityInCart(){
    this.quantityInCart =this.cartService.cart()?.items.find(x=> x.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  } 

  /** Going down to 0 is allowed only to remove an item already in the cart. */
  get minQuantity() {
    return this.quantityInCart > 0 ? 0 : 1;
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > this.minQuantity) this.quantity--;
  }

  getButtonText(){
    if (this.quantityInCart > 0 && this.quantity === 0) return 'Remove from cart';
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart'
  } 

  updateCart(){
    if(!this.product) return;
    if(this.quantity > this.quantityInCart){
      const itemToAdd = this.quantity -this.quantityInCart;
      this.quantityInCart += itemToAdd;
      this.cartService.addItemToCart(this.product, itemToAdd)
    }
    else{
      const itemToRemove = this.quantityInCart -this.quantity;
      this.quantityInCart -= itemToRemove;
      this.cartService.removeItemFromCart(this.product.id, itemToRemove)
    }
  }
}
