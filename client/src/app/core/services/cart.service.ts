import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl=environment.apiUrl
  private http = inject(HttpClient)
  
  cart=signal<Cart | null>(null);

  getCart(id:string){
    return this.http.get<Cart>(this.baseUrl+'cart?id='+id).pipe(
      map(cart => {
        this.cart.set(cart)
        return cart
      })
    );
  }

  setCart(cart:Cart){
    return this.http.post<Cart>(this.baseUrl+'cart',cart).subscribe({
      next: cart=> this.cart.set(cart)
    });
  }

  addItemToCart(item:CartItem | Product, quantity=1){
    const cart=this.cart() ?? this.createCart();
     if(this.idProduct(item)){
      item= this.mapProductToCartItem(item);
     }
     cart.items = this.addOrUpdateItem(cart.items, item, quantity);
     this.setCart(cart);
  }


  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index=items.findIndex(x=> x.productId === item.productId);
    if(index === -1){
      item.quantity=quantity;
      items.push(item);
    }
    else{
      items[index].quantity+= quantity;
    }
    return items
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName:item.name,
      price:item.price,
      quantity:0,
      pictureUrl:item.pictureUrl,
      brand:item.brand,
      type:item.type
    }
  }

  private idProduct( item:CartItem | Product): item is Product{
    return (item as Product ).id !==undefined;
  }

  createCart(): Cart {
    const cart= new Cart();
    localStorage.setItem('cart_id',cart.id);
    return cart;
  }

}
