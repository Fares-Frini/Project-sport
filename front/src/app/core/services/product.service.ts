import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Product, CreateProductDto, ProductFilter, UpdateProductDto, PagedResult } from '../models/product.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`; //Le serveur .NET reçoit cette demande,
    // cherche les produits dans la base de données, et les renvoie en format JSON à ton application Angular.

    constructor(private http: HttpClient) { }

    getAll(): Observable<Product[]> { //Récupère tous les produits avec images statique
        return this.http.get<Product[]>(this.apiUrl).pipe( // pipe: enchaîner des opérateurs sur un Observable (comme une requête HTTP). Au lieu de recevoir la donnée brute du serveur,
            // tu peux la transformer, la filtrer ou l'espionner avant qu'elle n'arrive à ton composant.
            map((products: Product[]) => products.map(p => this.assignImageUrl(p))), //transformer la réponse pour ajouter l'URL de l'image à chaque produit
            tap(data => console.log('ProductService: Liste des produits reçue avec images:', data))
        );
    }

    getById(id: number): Observable<Product> { //Récupère un produit par son ID
        return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
            map((product: Product) => this.assignImageUrl(product))
        );
    }

    private assignImageUrl(product: Product): Product { //Assigne une URL d'image à un produit
        // 1. Check if there's a custom URL in localStorage
        const customUrl = this.getCustomImageUrl(product.id);
        if (customUrl) { //Si une URL personnalisée existe dans localStorage
            return { ...product, imageUrl: customUrl }; //Retourne le produit avec l'URL personnalisée
        }

        const name = (product.name || '').toLowerCase();
        const category = (product.categoryName || '').toLowerCase();
        const sub = (product.subCategoryName || '').toLowerCase();
        const combined = `${name} ${category} ${sub}`;

        // Use Picsum photos with category seeds - always work, no CORS/referrer issues
        const imageMapping: { keywords: string[], url: string }[] = [
            { keywords: ['bike', 'bicycle', 'road', 'mountain', 'vélo', 'velo'], url: 'https://picsum.photos/seed/bicycle/800/600' },
            { keywords: ['helmet', 'casque'], url: 'https://picsum.photos/seed/helmet/800/600' },
            { keywords: ['glove', 'gant'], url: 'https://picsum.photos/seed/gloves/800/600' },
            { keywords: ['jersey', 'maillot', 'shirt', 'chemise'], url: 'https://picsum.photos/seed/jersey/800/600' },
            { keywords: ['bottle', 'bouteille', 'water'], url: 'https://picsum.photos/seed/water/800/600' },
            { keywords: ['shorts', 'short', 'pants', 'pantalon'], url: 'https://picsum.photos/seed/shorts/800/600' },
            { keywords: ['socks', 'chaussette', 'sock'], url: 'https://picsum.photos/seed/socks/800/600' },
            { keywords: ['shoe', 'shoes', 'chaussure', 'boot', 'botte'], url: 'https://picsum.photos/seed/shoes/800/600' },
            { keywords: ['tire', 'tyre', 'pneu'], url: 'https://picsum.photos/seed/tire/800/600' },
            { keywords: ['frame', 'cadre', 'fork'], url: 'https://picsum.photos/seed/frame/800/600' },
            { keywords: ['saddle', 'selle', 'seat'], url: 'https://picsum.photos/seed/saddle/800/600' },
            { keywords: ['components', 'composant', 'part', 'piece'], url: 'https://picsum.photos/seed/components/800/600' },
        ];

        for (const mapping of imageMapping) {
            if (mapping.keywords.some(k => combined.includes(k))) {
                return { ...product, imageUrl: mapping.url };
            }
        }

        // Use product.id as seed so each product always gets the same default image
        return { ...product, imageUrl: `https://picsum.photos/seed/${product.id ?? 'sport'}/800/600` };
    }

    saveCustomImageUrl(id: number, url: string): void {
        const customImages = this.getAllCustomImages();
        customImages[id] = url;
        localStorage.setItem('sportstore_custom_product_images', JSON.stringify(customImages));
    }

    getCustomImageUrl(id: number): string | null {
        return this.getAllCustomImages()[id] || null;
    }

    private getAllCustomImages(): { [key: number]: string } {
        try {
            const stored = localStorage.getItem('sportstore_custom_product_images');
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }
    //Récupère les produits selon des filtres spécifiques
    getByFilter(filter: ProductFilter): Observable<Product[]> {
        let params = new HttpParams() //Crée un objet HttpParams pour construire les paramètres de la requête HTTP
            .set('page', filter.page.toString()) //Ajoute le paramètre 'page' à la requête HTTP
            .set('pageSize', filter.pageSize.toString()); //Ajoute le paramètre 'pageSize' à la requête HTTP

        if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString()); //Ajoute le paramètre 'categoryId' à la requête HTTP
        if (filter.subCategoryId) params = params.set('subCategoryId', filter.subCategoryId.toString()); //Ajoute le paramètre 'subCategoryId' à la requête HTTP
        if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString()); //Ajoute le paramètre 'minPrice' à la requête HTTP
        if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString()); //Ajoute le paramètre 'maxPrice' à la requête HTTP
        if (filter.sortBy) params = params.set('sortBy', filter.sortBy); //Ajoute le paramètre 'sortBy' à la requête HTTP

        return this.http.get<Product[]>(this.apiUrl, { params }); //Envoie la requête HTTP avec les paramètres
    }

    getFeatured(): Observable<Product[]> { //Récupère les produits mis en avant
        return this.http.get<Product[]>(`${this.apiUrl}/featured`); //Envoie la requête HTTP avec les paramètres
    }

    create(product: CreateProductDto): Observable<Product> { //Crée un nouveau produit
        return this.http.post<Product>(this.apiUrl, product); //Envoie la requête HTTP avec les paramètres
    }

    update(id: number, product: UpdateProductDto): Observable<Product> { //Met à jour un produit existant
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product); //Envoie la requête HTTP avec les paramètres
    }

    delete(id: number): Observable<void> { //Supprime un produit
        return this.http.delete<void>(`${this.apiUrl}/${id}`); //Envoie la requête HTTP avec les paramètres
    }
}
