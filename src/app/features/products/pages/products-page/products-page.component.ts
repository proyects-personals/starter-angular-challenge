import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductDeleteComponent } from '../../components/product-delete/product-delete/product-delete.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductListComponent,
    ProductFormComponent,
    ProductDeleteComponent,
  ],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent implements OnInit {
  private readonly DEFAULT_ITEMS_PER_PAGE = 5;
  private readonly ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

  private readonly productService = inject(ProductService);

  products: Product[] = [];
  filteredProducts: Product[] = [];

  loading = false;
  errorMessage: string | null = null;

  searchTerm = '';
  itemsPerPage = this.DEFAULT_ITEMS_PER_PAGE;
  itemsPerPageOptions = this.ITEMS_PER_PAGE_OPTIONS;

  showModal = false;
  editingProduct: Product | null = null;

  showDeleteConfirmation = false;
  productToDelete: Product | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.setLoading(true);
    this.errorMessage = null;

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.setLoading(false);
      },
      error: () => {
        this.setError('Error cargando productos');
        this.setLoading(false);
      },
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = term
      ? this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      )
      : [...this.products];
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onItemsPerPageChange(newItemsPerPage?: number): void {
    if (newItemsPerPage && this.itemsPerPageOptions.includes(newItemsPerPage)) {
      this.itemsPerPage = newItemsPerPage;
    }
  }

  openAddProductModal(): void {
    this.editingProduct = null;
    this.showModal = true;
  }

  openEditProductModal(product: Product): void {
    this.editingProduct = product;
    this.showModal = true;
  }

  onModalClose(): void {
    this.showModal = false;
    this.editingProduct = null;
  }

  onProductSaved(): void {
    this.loadProducts();
    this.onModalClose();
  }

  confirmDeleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteConfirmation = true;
  }

  handleConfirmDelete(): void {
    if (!this.productToDelete) return;

    this.setLoading(true);

    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.loadProducts();
        this.resetDeleteConfirmation();
      },
      error: () => {
        this.setError('Error eliminando el producto');
        this.setLoading(false);
        this.resetDeleteConfirmation();
      },
    });
  }

  handleCancelDelete(): void {
    this.resetDeleteConfirmation();
  }

  private resetDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.productToDelete = null;
  }

  private setLoading(state: boolean): void {
    this.loading = state;
  }

  private setError(message: string): void {
    this.errorMessage = message;
  }
}
