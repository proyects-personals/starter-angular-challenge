import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { validateId, validateName, validateDescription, validateLogo, validateDateRelease, validateDateRevision } from '../../../../shared/utils/product-form.utils';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() productToEdit?: Product | null;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<void>();
  @Output() productSaved = new EventEmitter<Product>();

  isLoading = false;
  isEdit = false;
  isValidatingId = false;

  product: Product = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
  };

  idError = '';
  nameError = '';
  descriptionError = '';
  logoError = '';
  dateReleaseError = '';
  dateRevisionError = '';

  touchedFields = {
    id: false,
    name: false,
    description: false,
    logo: false,
    date_release: false,
    date_revision: false,
  };

  private idInput$ = new Subject<string>();

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.idInput$
      .pipe(
        debounceTime(100),
        switchMap((id) => {
          this.isValidatingId = true;
          return this.productService.verifyProductIdExists(id);
        })
      )
      .subscribe({
        next: (exists) => {
          this.isValidatingId = false;
          this.idError = exists ? 'El ID ya existe.' : '';
        },
        error: () => {
          this.isValidatingId = false;
          this.idError = 'Error al verificar el ID.';
        },
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productToEdit'] && this.productToEdit) {
      this.isEdit = true;
      this.product = { ...this.productToEdit };
      this.clearErrorsAndTouched();
    } else if (!this.productToEdit) {
      this.isEdit = false;
      this.resetForm();
    }
  }

  onBlur(field: keyof typeof this.touchedFields) {
    this.touchedFields[field] = true;
    this.validateField(field);
  }

  validateField(field: keyof typeof this.touchedFields) {
    const val = this.product[field as keyof Product]?.toString().trim();

    switch (field) {
      case 'id':
        this.idError = validateId(val, this.isEdit);
        if (!this.isEdit && !this.idError) this.idInput$.next(val);
        break;
      case 'name':
        this.nameError = validateName(val);
        break;
      case 'description':
        this.descriptionError = validateDescription(val);
        break;
      case 'logo':
        this.logoError = validateLogo(val);
        break;
      case 'date_release':
        this.dateReleaseError = validateDateRelease(this.product.date_release);
        break;
      case 'date_revision':
        this.dateRevisionError = validateDateRevision(
          this.product.date_release,
          this.product.date_revision
        );
        break;
    }
  }

  validateForm(): boolean {
    Object.keys(this.touchedFields).forEach((key) => {
      this.validateField(key as keyof typeof this.touchedFields);
    });

    return !this.idError &&
      !this.nameError &&
      !this.descriptionError &&
      !this.logoError &&
      !this.dateReleaseError &&
      !this.dateRevisionError;
  }

  saveProduct() {
    if (!this.validateForm()) {
      Object.keys(this.touchedFields).forEach(
        (key) => (this.touchedFields[key as keyof typeof this.touchedFields] = true)
      );
      return;
    }

    this.isLoading = true;

    const productData = {
      name: this.product.name.trim(),
      description: this.product.description.trim(),
      logo: this.product.logo.trim(),
      date_release: this.product.date_release,
      date_revision: this.product.date_revision,
    };

    const request$ = this.isEdit
      ? this.productService.updateProduct(this.product.id, productData)
      : this.productService.createProduct({ ...productData, id: this.product.id.trim() });

    request$.subscribe({
      next: (savedProduct) => {
        this.isLoading = false;
        this.productSaved.emit(savedProduct);
        this.resetForm();
        this.closeModal();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  resetForm() {
    this.product = {
      id: this.isEdit ? this.product.id : '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
    this.clearErrorsAndTouched();
  }

  clearErrorsAndTouched() {
    this.idError = '';
    this.nameError = '';
    this.descriptionError = '';
    this.logoError = '';
    this.dateReleaseError = '';
    this.dateRevisionError = '';

    Object.keys(this.touchedFields).forEach(
      (key) => (this.touchedFields[key as keyof typeof this.touchedFields] = false)
    );
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }
}
