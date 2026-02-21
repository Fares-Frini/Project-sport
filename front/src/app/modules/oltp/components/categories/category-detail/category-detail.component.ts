import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../../core/services/category.service';
import { SubCategoryService } from '../../../../../core/services/subcategory.service';
import { Category } from '../../../../../core/models/category.model';
import { SubCategory } from '../../../../../core/models/subcategory.model';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  category: Category | null = null;
  subCategories: SubCategory[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCategory(+id);
      this.loadSubCategories(+id);
    }
  }

  loadCategory(id: number): void {
    this.isLoading = true;
    this.categoryService.getById(id).subscribe({
      next: (data) => {
        if (data) {
          this.category = data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadSubCategories(categoryId: number): void {
    this.subCategoryService.getAll().subscribe({
      next: (data) => {
        this.subCategories = data.filter((s) => s.categoryId === categoryId);
      },
      error: (err) => console.error(err)
    });
  }
}
