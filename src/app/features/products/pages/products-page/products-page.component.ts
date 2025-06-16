import { Component } from '@angular/core';
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
  imports: [CommonModule, FormsModule, ProductListComponent, ProductFormComponent, ProductDeleteComponent],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  errorMessage: string | null = null;

  searchTerm = '';
  itemsPerPage = 5;
  itemsPerPageOptions = [5, 10, 20, 50];

  showModal = false;
  editingProduct: Product | null = null;

  showDeleteConfirmation = false;
  productToDelete: Product | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = null;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error cargando productos';
        this.loading = false;
      },
    });
  }

  applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  onSearchChange() {
    this.applyFilters();
  }

  onItemsPerPageChange(newItemsPerPage?: number) {
    if (newItemsPerPage) this.itemsPerPage = newItemsPerPage;
  }

  openAddProductModal() {
    this.editingProduct = null;
    this.showModal = true;
  }

  openEditProductModal(product: Product) {
    this.editingProduct = product;
    this.showModal = true;
  }

  onModalClose() {
    this.showModal = false;
    this.editingProduct = null;
  }

  onProductSaved(savedProduct: Product) {
    this.loadProducts();
    this.showModal = false;
    this.editingProduct = null;
  }

  confirmDeleteProduct(product: Product) {
    this.productToDelete = product;
    this.showDeleteConfirmation = true;
  }

  handleConfirmDelete() {
    if (!this.productToDelete) return;
    this.loading = true;
    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.loadProducts();
        this.showDeleteConfirmation = false;
        this.productToDelete = null;
      },
      error: () => {
        this.errorMessage = 'Error eliminando el producto';
        this.loading = false;
        this.showDeleteConfirmation = false;
        this.productToDelete = null;
      },
    });
  }

  handleCancelDelete() {
    this.showDeleteConfirmation = false;
    this.productToDelete = null;
  }
}
