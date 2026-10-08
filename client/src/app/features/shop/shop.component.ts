import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatCheckbox } from '@angular/material/checkbox';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatCheckbox,
    MatPaginator,
    FormsModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  products?: Pagination<Product>;
  loading = false;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: low to high', value: 'priceAsc' },
    { name: 'Price: high to low', value: 'priceDesc' },
  ];
  shopParams = new ShopParams();
  pageSizeOptions = [5, 10, 15, 20];
  skeletons = Array.from({ length: 8 }, (_, i) => i);

  ngOnInit() {
    this.shopService.getTypes();
    this.shopService.getBrands();

    // The `type` query param (used by home and footer links) drives the type filter.
    // It also fires when the param changes while staying on this page.
    let first = true;
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const types = this.parseTypes(params.get('type'));
        const changed = !this.sameItems(types, this.shopParams.types);
        if (changed) {
          this.shopParams.types = types;
          this.shopParams.pageNumber = 1;
        }
        if (first || changed) this.getProducts();
        first = false;
      });
  }

  get sortLabel() {
    return this.sortOptions.find(x => x.value === this.shopParams.sort)?.name ?? 'Sort';
  }

  get pageCount() {
    return this.products ? Math.max(1, Math.ceil(this.products.count / this.shopParams.pageSize)) : 1;
  }

  get hasActiveFilters() {
    return this.shopParams.brands.length > 0 || this.shopParams.types.length > 0 || !!this.shopParams.search;
  }

  get activeFilterCount() {
    return this.shopParams.brands.length + this.shopParams.types.length;
  }

  resetFilters() {
    this.shopParams = new ShopParams();
    this.syncUrl();
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.error(error);
      }
    });
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  clearSearch() {
    this.shopParams.search = '';
    this.onSearchChange();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(value: string) {
    if (value === this.shopParams.sort) return;
    this.shopParams.sort = value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  isSelected(list: 'brands' | 'types', value: string) {
    return this.shopParams[list].includes(value);
  }

  toggleFilter(list: 'brands' | 'types', value: string, checked: boolean) {
    const current = this.shopParams[list];
    this.applyFilters({
      ...this.currentFilters(),
      [list === 'brands' ? 'selectedBrands' : 'selectedTypes']:
        checked ? [...current, value] : current.filter(x => x !== value),
    });
  }

  removeFilter(list: 'brands' | 'types', value: string) {
    this.toggleFilter(list, value, false);
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      width: '560px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      data: this.currentFilters(),
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) this.applyFilters(result);
      }
    });
  }

  private currentFilters() {
    return { selectedBrands: this.shopParams.brands, selectedTypes: this.shopParams.types };
  }

  private applyFilters(result: { selectedBrands: string[]; selectedTypes: string[] }) {
    this.shopParams.brands = result.selectedBrands;
    this.shopParams.types = result.selectedTypes;
    this.shopParams.pageNumber = 1;
    this.syncUrl();
    this.getProducts();
  }

  /** Keep the `type` query param in line with the selected types (no reload, see ngOnInit). */
  private syncUrl() {
    const type = this.shopParams.types.length ? this.shopParams.types.join(',') : null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private parseTypes(value: string | null) {
    return value ? value.split(',').map(x => x.trim()).filter(Boolean) : [];
  }

  private sameItems(a: string[], b: string[]) {
    return a.length === b.length && a.every(x => b.includes(x));
  }
}
