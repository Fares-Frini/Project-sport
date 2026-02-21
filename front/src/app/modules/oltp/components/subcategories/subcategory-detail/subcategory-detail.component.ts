import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubCategoryService } from '../../../../../core/services/subcategory.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { SubCategory } from '../../../../../core/models/subcategory.model';

@Component({
  selector: 'app-subcategory-detail',
  templateUrl: './subcategory-detail.component.html',
  styleUrls: ['./subcategory-detail.component.scss']
})
export class SubcategoryDetailComponent implements OnInit {
  subCategory: SubCategory | null = null;
  parentCategoryName: string = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSubCategory(+id);
    }
  }

  loadSubCategory(id: number): void {
    this.isLoading = true;
    this.subCategoryService.getById(id).subscribe({
      next: (data) => {
        if (data) {
          this.subCategory = data;
          this.loadParentCategory(data.categoryId);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadParentCategory(id: number): void {
    this.categoryService.getById(id).subscribe({
      next: (data) => {
        this.parentCategoryName = data.name;
      },
      error: (err) => console.error(err)
    });
  }
}
