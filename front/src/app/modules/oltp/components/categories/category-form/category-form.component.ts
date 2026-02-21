import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../../core/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.category) {
      this.isEditMode = true;
      this.categoryId = this.data.category.id;
      this.categoryForm.patchValue(this.data.category);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditMode = true;
        this.categoryId = +id;
        this.loadCategory(this.categoryId);
      }
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getById(id).subscribe({
      next: (data) => {
        this.categoryForm.patchValue(data);
      },
      error: (err) => console.error(err)
    });
  }

  get f() { return this.categoryForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const categoryData = this.categoryForm.value;

    const request = this.isEditMode && this.categoryId
      ? this.categoryService.update(this.categoryId, categoryData)
      : this.categoryService.create(categoryData);

    request.subscribe({
      next: () => {
        if (this.dialogRef) {
          this.dialogRef.close(true);
        } else {
          this.router.navigate(['/admin/categories']);
        }
      },
      error: (err) => {
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
      this.router.navigate(['/admin/categories']);
    }
  }
}
