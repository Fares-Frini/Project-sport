import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../../core/services/product.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { SubCategoryService } from '../../../../../core/services/subcategory.service';
import { Category } from '../../../../../core/models/category.model';
import { SubCategory } from '../../../../../core/models/subcategory.model';
import { Product } from '../../../../../core/models/product.models';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {
  articleForm!: FormGroup;
  isEdit = false;
  productId?: number;
  categories: Category[] = [];
  subcategories: SubCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  //creation et modification d'un article
  ngOnInit(): void {
    this.initForm();
    this.loadData();

    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.productId = +idParam;
      this.isEdit = true;
      this.productService.getById(this.productId).subscribe(product => {
        if (product) {
          this.articleForm.patchValue(product);
        }
      });
    }
  }

  private initForm(): void {
    this.articleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      imageUrl: ['']
    });
  }

  private loadData(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    // Initially load all subcategories or filter based on selected category if needed
    this.subCategoryService.getAll().subscribe(subs => {
      this.subcategories = subs;
      if (this.isEdit && this.productId) {
        const customUrl = this.productService.getCustomImageUrl(this.productId);
        if (customUrl) {
          this.articleForm.patchValue({ imageUrl: customUrl });
        }

      }
    });
  }

  onCategoryChange(categoryId: number): void {
    this.articleForm.get('categoryId')?.setValue(categoryId);
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      const { imageUrl, ...productData } = this.articleForm.value;
      if (this.isEdit && this.productId) {
        this.productService.update(this.productId, productData).subscribe(() => {
          if (imageUrl) {
            this.productService.saveCustomImageUrl(this.productId!, imageUrl);
          }
          this.router.navigate(['/admin/articles']);
        });
      } else {
        this.productService.create(productData).subscribe(newProduct => {
          if (imageUrl && newProduct.id) {
            this.productService.saveCustomImageUrl(newProduct.id, imageUrl);
          }
          this.router.navigate(['/admin/articles']);
        });
      }
    }
  }
}
