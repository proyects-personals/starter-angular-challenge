import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.css']
})
export class ProductDeleteComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = '¿Estás seguro?';
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  onConfirm() {
    this.confirmDelete.emit();
  }

  onCancel() {
    this.cancelDelete.emit();
  }
}
