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

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  public form!: FormGroup;

  filter: ProductFilter = {
    page: 1,
    pageSize: 12
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadArticles();
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    this.subCategoryService.getAll().subscribe(subs => this.subcategories = subs);
  }

  private initForm(): void {
    this.form = this.fb.group({
      searchTerm: [''],
      categoryId: [undefined],
      subCategoryId: [undefined],
      minPrice: [null],
      maxPrice: [null]
    });

    this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(values => {
      this.filter = { ...this.filter, ...values, page: 1 };
      this.loadArticles();
    });
  }

  loadArticles(): void {
    this.productService.getByFilter(this.filter).subscribe(result => {
      this.products = result;
    });
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product, 1);
  }
}
