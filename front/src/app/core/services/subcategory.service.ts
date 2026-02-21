import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SubCategory, CreateSubCategoryDto, UpdateSubCategoryDto } from '../models/subcategory.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubCategoryService {
    private apiUrl = `${environment.apiUrl}/subcategories`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<SubCategory[]> {
        return this.http.get<SubCategory[]>(this.apiUrl).pipe(
            tap((data: SubCategory[]) => console.log('SubCategoryService: Liste des sous-catégories reçue:', data))
        );
    }

    getById(id: number): Observable<SubCategory> {
        return this.http.get<SubCategory>(`${this.apiUrl}/${id}`);
    }

    create(subcategory: CreateSubCategoryDto): Observable<SubCategory> {
        return this.http.post<SubCategory>(this.apiUrl, subcategory);
    }

    update(id: number, subcategory: UpdateSubCategoryDto): Observable<SubCategory> {
        return this.http.put<SubCategory>(`${this.apiUrl}/${id}`, subcategory);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getByCategory(categoryId: number): Observable<SubCategory[]> {
        return this.http.get<SubCategory[]>(`${this.apiUrl}/category/${categoryId}`);
    }
}
