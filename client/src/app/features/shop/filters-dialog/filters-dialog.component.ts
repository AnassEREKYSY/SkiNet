import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatCheckbox,
    MatIcon,
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {
  shopService = inject(ShopService);
  private dialogRef = inject(MatDialogRef<FiltersDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  // Work on copies so closing the dialog without applying leaves the shop untouched.
  selectedBrands: string[] = [...(this.data.selectedBrands ?? [])];
  selectedTypes: string[] = [...(this.data.selectedTypes ?? [])];

  toggle(list: 'brands' | 'types', value: string, checked: boolean) {
    const key = list === 'brands' ? 'selectedBrands' : 'selectedTypes';
    this[key] = checked ? [...this[key], value] : this[key].filter(x => x !== value);
  }

  clear() {
    this.selectedBrands = [];
    this.selectedTypes = [];
  }

  close() {
    this.dialogRef.close();
  }

  applyFilters() {
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes,
    });
  }
}
