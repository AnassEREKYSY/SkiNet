import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl="https://localhost:5001/api/";
  private http = inject(HttpClient);

  products: Product[]=[];

  types:string[]=[];
  brands:string[]=[];

  getProducts(): Observable<Pagination<Product>>{
    return this.http.get<Pagination<Product>>(this.baseUrl+'products?pageSize=20');
  }

  getTypes(){
    if(this.types.length>0) return;
    return this.http.get<string[]>(this.baseUrl+'products/types').subscribe({
      next:response => this.types = response
    });
  }

  getBrands(){
      if(this.brands.length>0) return;
    return this.http.get<string[]>(this.baseUrl+'products/brands').subscribe({
      next:response => this.brands = response
    });
  }
}
