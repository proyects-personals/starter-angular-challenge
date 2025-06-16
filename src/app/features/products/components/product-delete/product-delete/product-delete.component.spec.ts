import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDeleteComponent } from './product-delete.component';

describe('ProductDeleteComponent', () => {
  let component: ProductDeleteComponent;
  let fixture: ComponentFixture<ProductDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir confirm al llamar onConfirm', () => {
    jest.spyOn(component.confirmDelete, 'emit');
    component.onConfirm();
    expect(component.confirmDelete.emit).toHaveBeenCalled();
  });

  it('debería emitir cancel al llamar onCancel', () => {
    jest.spyOn(component.cancelDelete, 'emit');
    component.onCancel();
    expect(component.cancelDelete.emit).toHaveBeenCalled();
  });

  it('debería aceptar un mensaje personalizado', () => {
    component.message = 'Mensaje de prueba';
    expect(component.message).toBe('Mensaje de prueba');
  });

  it('debería aceptar cambiar visibilidad', () => {
    component.isVisible = true;
    expect(component.isVisible).toBe(true);
    component.isVisible = false;
    expect(component.isVisible).toBe(false);
  });
});
