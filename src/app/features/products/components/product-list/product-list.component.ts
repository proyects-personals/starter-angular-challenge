import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../core/models/product.model';
import { SkeletonTableComponent } from '../../../../shared/skeletons/skeleton-table/skeleton-table.component';
import { DateSlashPipe } from '../../../../shared/pipes/date-slash.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonTableComponent, DateSlashPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  @Input() filteredProducts: Product[] = [];
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  @Input() itemsPerPage = 5;
  @Input() itemsPerPageOptions: number[] = [];

  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  openActionMenuIndex: number | null = null;

  toggleActionMenu(index: number) {
    this.openActionMenuIndex = this.openActionMenuIndex === index ? null : index;
  }

  closeActionMenu() {
    this.openActionMenuIndex = null;
  }

  onEditProduct(product: Product) {
    this.editProduct.emit(product);
  }

  onDeleteProduct(product: Product) {
    this.deleteProduct.emit(product);
  }

  onItemsPerPageChange() {
    this.itemsPerPageChange.emit(this.itemsPerPage);
  }
}
