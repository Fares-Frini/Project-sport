import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product, CreateProductDto, ProductFilter, UpdateProductDto, PagedResult } from '../models/product.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl).pipe(
            tap(data => console.log('ProductService: Liste des produits reçue:', data))
        );
    }

    getById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    getByFilter(filter: ProductFilter): Observable<Product[]> {
        let params = new HttpParams()
            .set('page', filter.page.toString())
            .set('pageSize', filter.pageSize.toString());

        if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
        if (filter.subCategoryId) params = params.set('subCategoryId', filter.subCategoryId.toString());
        if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
        if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
        if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

        return this.http.get<Product[]>(this.apiUrl, { params });
    }

    getFeatured(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/featured`);
    }

    create(product: CreateProductDto): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    update(id: number, product: UpdateProductDto): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getCustomImageUrl(productId: number): string | null {
        return localStorage.getItem(`product_image_${productId}`);
    }

    saveCustomImageUrl(productId: number, imageUrl: string): void {
        localStorage.setItem(`product_image_${productId}`, imageUrl);
    }
}
