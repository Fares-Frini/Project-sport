import { Component, OnInit } from '@angular/core';
import { Product, ProductFilter } from '../../../../core/models/product.models';
import { Category } from '../../../../core/models/category.model';
import { SubCategory } from '../../../../core/models/subcategory.model';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { SubCategoryService } from '../../../../core/services/subcategory.service';
import { CartService } from '../../../../core/services/cart.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductDetailComponent } from '../article-detail/product-detail.component';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  private allProducts: Product[] = [];
  categories: Category[] = [];
  public form!: FormGroup;
  isAdmin = false;

  filter: ProductFilter = {
    page: 1,
    pageSize: 12
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.initForm();
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadArticles();
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
  }

  private initForm(): void {
    this.form = this.fb.group({
      searchTerm: [''],
      categoryId: [undefined],
      minPrice: [null],
      maxPrice: [null]
    });

    this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  loadArticles(): void {
    if (this.allProducts.length === 0) {
      this.productService.getAll().subscribe(result => {
        this.allProducts = result;
        this.applyFilters();
      });
    } else {
      this.applyFilters();
    }
  }

  private applyFilters(): void {
    const { searchTerm, categoryId, minPrice, maxPrice } = this.form.value;

    const normCat = (categoryId !== null && categoryId !== undefined && categoryId !== '')
      ? Number(categoryId) : null;
    const normMin = (minPrice !== null && minPrice !== '') ? Number(minPrice) : null;
    const normMax = (maxPrice !== null && maxPrice !== '') ? Number(maxPrice) : null;

    this.products = this.allProducts.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = normCat === null || Number(p.categoryId) === normCat;
      const matchesMinPrice = normMin === null || p.price >= normMin;
      const matchesMaxPrice = normMax === null || p.price <= normMax;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product, 1);
    alert(`${product.name} ajouté au panier !`);
  }

  viewProductDetails(product: Product): void {
    this.dialog.open(ProductDetailComponent, {
      width: '800px',
      data: { id: product.id }
    });
  }
}
