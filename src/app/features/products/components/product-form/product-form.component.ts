import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { validateDateRevisionAfterRelease } from '../../../../shared/utils/product-form.utils';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() productToEdit?: Product | null;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<void>();
  @Output() productSaved = new EventEmitter<Product>();

  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  isEdit = false;
  isLoading = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productToEdit']) {
      this.isEdit = !!this.productToEdit;
      this.initForm(this.productToEdit || undefined);
    }
  }

  initForm(product?: Product): void {
    this.form = this.fb.group(
      {
        id: [
          { value: product?.id || '', disabled: this.isEdit },
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9_-]+$/),
          ],
          this.isEdit ? [] : [this.productIdValidator()],
        ],
        name: [
          product?.name || '',
          [Validators.required, Validators.maxLength(100)],
        ],
        description: [
          product?.description || '',
          [Validators.required, Validators.maxLength(255)],
        ],
        logo: [
          product?.logo || '',
          [Validators.required, Validators.pattern(/^https:\/\/.+/)],
        ],
        date_release: [product?.date_release || '', Validators.required],
        date_revision: [product?.date_revision || '', Validators.required],
      },
      {
        validators: validateDateRevisionAfterRelease('date_release', 'date_revision'),
      }
    );
  }

  productIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value?.trim();
      if (!id) return of(null);

      return timer(300).pipe(
        switchMap(() => this.productService.verifyProductIdExists(id)),
        map((exists) => (exists ? { idTaken: true } : null)),
        catchError(() => of({ idCheckFailed: true }))
      );
    };
  }

  saveProduct(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.form.getRawValue();

    const request$ = this.isEdit
      ? this.productService.updateProduct(this.productToEdit!.id, formData)
      : this.productService.createProduct(formData);

    request$.subscribe({
      next: (savedProduct) => {
        this.isLoading = false;
        this.productSaved.emit(savedProduct);
        this.form.reset();
        this.closeModal();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  closeModal(): void {
    this.isVisible = false;
    this.close.emit();
  }

  fieldHasError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.touched && control.hasError(errorCode));
  }

  resetForm(): void {
    if (this.isEdit && this.productToEdit) {
      this.initForm(this.productToEdit);
    } else {
      this.form.reset();
    }
  }

}
