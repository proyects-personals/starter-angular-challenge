import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ProductsPageComponent } from './products-page.component';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';

describe('ProductsPageComponent', () => {
  let component: ProductsPageComponent;
  let fixture: ComponentFixture<ProductsPageComponent>;
  let productService: jest.Mocked<ProductService>;

  const mockProducts: Product[] = [
    { id: '1', name: 'Producto 1', description: 'Desc 1', logo: '', date_release: '', date_revision: '' },
    { id: '2', name: 'Producto 2', description: 'Desc 2', logo: 'logo', date_release: '', date_revision: '' }
  ];

  beforeEach(async () => {
    const productServiceMock: jest.Mocked<ProductService> = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProductsPageComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products successfully', () => {
    productService.getProducts.mockReturnValue(of(mockProducts));

    component.loadProducts();

    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBeNull();
  });

  it('should handle error when loading products', () => {
    productService.getProducts.mockReturnValue(throwError(() => new Error('Error')));

    component.loadProducts();

    expect(component.errorMessage).toBe('Error cargando productos');
    expect(component.loading).toBe(false);
  });
});
