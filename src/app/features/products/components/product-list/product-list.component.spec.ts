import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { Product } from '../../../../core/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería abrir y cerrar el menú de acción', () => {
    component.toggleActionMenu(1);
    expect(component.openActionMenuIndex).toBe(1);

    component.toggleActionMenu(1);
    expect(component.openActionMenuIndex).toBeNull();

    component.toggleActionMenu(2);
    expect(component.openActionMenuIndex).toBe(2);

    component.closeActionMenu();
    expect(component.openActionMenuIndex).toBeNull();
  });

  it('debería emitir evento editProduct con el producto correcto', () => {
    const product: Product = { id: '123', name: 'Producto 1' } as Product;
    jest.spyOn(component.editProduct, 'emit');

    component.onEditProduct(product);
    expect(component.editProduct.emit).toHaveBeenCalledWith(product);
  });

  it('debería emitir evento deleteProduct con el producto correcto', () => {
    const product: Product = { id: '456', name: 'Producto 2' } as Product;
    jest.spyOn(component.deleteProduct, 'emit');

    component.onDeleteProduct(product);
    expect(component.deleteProduct.emit).toHaveBeenCalledWith(product);
  });

  it('debería emitir itemsPerPageChange con el valor correcto', () => {
    jest.spyOn(component.itemsPerPageChange, 'emit');

    component.itemsPerPage = 10;
    component.onItemsPerPageChange();

    expect(component.itemsPerPageChange.emit).toHaveBeenCalledWith(10);
  });
});
