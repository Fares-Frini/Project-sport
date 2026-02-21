import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubCategoryService } from '../../../../../core/services/subcategory.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { Category } from '../../../../../core/models/category.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subcategory-form',
  templateUrl: './subcategory-form.component.html',
  styleUrls: ['./subcategory-form.component.scss']
})
export class SubcategoryFormComponent implements OnInit {
  subCategoryForm: FormGroup;
  isEditMode = false;
  subCategoryId: number | null = null;
  categories: Category[] = [];
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<SubcategoryFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.subCategory) {
      this.isEditMode = true;
      this.subCategoryId = data.subCategory.id;
      this.categories = data.categories || [];
    }

    this.subCategoryForm = this.formBuilder.group({
      name: [data?.subCategory?.name || '', [Validators.required, Validators.minLength(3)]],
      categoryId: [data?.subCategory?.categoryId || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.subCategoryId = +id;
      this.loadSubCategory(this.subCategoryId);
    }
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  loadSubCategory(id: number): void {
    this.subCategoryService.getById(id).subscribe({
      next: (data) => {
        this.subCategoryForm.patchValue(data);
      },
      error: (err) => console.error(err)
    });
  }

  get f() { return this.subCategoryForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.subCategoryForm.invalid) {
      return;
    }

    this.loading = true;
    const subCategoryData = this.subCategoryForm.value;
    // Cast to number
    subCategoryData.categoryId = +subCategoryData.categoryId;

    const request = this.isEditMode && this.subCategoryId
      ? this.subCategoryService.update(this.subCategoryId, subCategoryData)
      : this.subCategoryService.create(subCategoryData);

    request.subscribe({
      next: () => {
        if (this.dialogRef) {
          this.dialogRef.close(true);
        } else {
          this.router.navigate(['/subcategories']);
        }
      },
      error: (err: any) => {
        this.error = 'Une erreur est survenue';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/subcategories']);
    }
  }
}
