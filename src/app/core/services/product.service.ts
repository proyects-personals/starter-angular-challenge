import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product } from '../models/product.model';
import { API_BASE_URL } from '../tokens/api-url.token';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // En vez de constructor, usamos inject()
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  getProducts(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.baseUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<{ message: string; data: Product }>(this.baseUrl, product).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.put<{ message: string; data: Product }>(`${this.baseUrl}/${id}`, product).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<string> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.message),
      catchError(this.handleError)
    );
  }

  verifyProductIdExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else if (error.status === 400) {
      errorMessage = 'Bad Request - Invalid data sent';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.status) {
      errorMessage = `Server returned code ${error.status}, message: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
