import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopeService =  inject(ShopService);
  private dialogService = inject(MatDialog);
  products: Product[]=[];
  selectedBrands:string[]=[];
  selectedTypes:string[]=[];

  ngOnInit(): void {
    this.initializeShope();
  }

  initializeShope(){
    this.shopeService.getBrands();
    this.shopeService.getTypes();
    this.shopeService.getProducts().subscribe({
      next : response => this.products=response.data,
      error : error => console.log(error),
     });
  }

  openFiltersDialog(){
    const dialogRef=this.dialogService.open(FiltersDialogComponent, {
      minWidth:'500px',
      data:{
        selectedBrands:this.selectedBrands,
        selectedTypes:this.selectedTypes
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result =>{
        if(result){
          console.log(result);
          this.selectedBrands = result.selectedBrands;
          this.selectedTypes = result.selectedTypes;
        }
      }
    })
  }
}
