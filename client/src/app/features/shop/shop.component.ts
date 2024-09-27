import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopeService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;
  sortOptions=[
    {name:"Alphabetical", value:"name"},
    {name:"Price :Low-Heigh", value:"priceAsc"},
    {name:"Price :Heigh-Low", value:"priceDesc"}
  ]
  shopParams=new ShopParams();
  pageSizeOptions =[5,10,15,20];
  ngOnInit(): void {
    this.initializeShope();
  }

  initializeShope() {
    this.shopeService.getBrands();
    this.shopeService.getTypes();
    this.getProducts();
  }

  getProducts(){
    this.shopeService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response,
      error: error => console.log(error),
    });
  }

  onSortChange(event:MatSelectionListChange){
    const selectedOption=event.options[0];
    if(selectedOption){
      this.shopParams.sort=selectedOption.value;
      this.shopParams.pageNumber=1;
      this.getProducts();
    }
  }

  onSearchChange(){
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  handlePageEvent(event:PageEvent){
    this.shopParams.pageNumber=event.pageIndex+1;
    this.shopParams.pageSize=event.pageSize;
    this.getProducts();
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber=1;
          this.getProducts()
        }
      }
    })
  }
}
