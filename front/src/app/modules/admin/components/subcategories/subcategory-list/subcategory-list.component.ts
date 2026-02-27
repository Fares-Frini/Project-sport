import { Component, OnInit } from '@angular/core';
import { SubCategoryService } from '../../../../../core/services/subcategory.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { SubCategory } from '../../../../../core/models/subcategory.model';
import { Category } from '../../../../../core/models/category.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SubcategoryFormComponent } from '../subcategory-form/subcategory-form.component';
import { SubcategoryDetailComponent } from '../subcategory-detail/subcategory-detail.component';

@Component({
    selector: 'app-subcategory-list',
    templateUrl: './subcategory-list.component.html',
    styleUrls: ['./subcategory-list.component.scss']
})
export class SubcategoryListComponent implements OnInit {
    subCategories: SubCategory[] = [];
    categories: Category[] = [];
    isLoading = false;
    isAdmin = false;
    selectedCategoryId: number | null = null;
    filteredSubCategories: SubCategory[] = [];
    displayedColumns: string[] = ['id', 'name', 'categoryName', 'actions'];

    constructor(
        private subCategoryService: SubCategoryService,
        private categoryService: CategoryService,
        private authService: AuthService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.isAdmin = this.authService.isAdmin();
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        this.categoryService.getAll().subscribe((cats: Category[]) => {
            this.categories = cats;
        });

        this.subCategoryService.getAll().subscribe((data: SubCategory[]) => {
            this.subCategories = data;
            this.filterSubCategories();
            this.isLoading = false;
        });
    }

    onCategoryFilterChange(event: any): void {
        const value = event.target.value;
        this.selectedCategoryId = value ? +value : null;
        this.filterSubCategories();
    }

    filterSubCategories(): void {
        if (this.selectedCategoryId) {
            this.filteredSubCategories = this.subCategories.filter(s => s.categoryId === this.selectedCategoryId);
        } else {
            this.filteredSubCategories = this.subCategories;
        }
    }

    deleteSubCategory(id: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?')) {
            this.subCategoryService.delete(id).subscribe(() => {
                this.loadData();
            });
        }
    }

    getCategoryName(id: number): string {
        const cat = this.categories.find(c => c.id === id);
        return cat ? cat.name : 'Inconnue';
    }

    openSubCategoryForm(subCategory?: SubCategory): void {
        const dialogRef = this.dialog.open(SubcategoryFormComponent, {
            width: '500px',
            data: { subCategory, categories: this.categories }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }

    viewSubCategory(sub: SubCategory): void {
        this.dialog.open(SubcategoryDetailComponent, {
            width: '600px',
            data: { id: sub.id }
        });
    }
}
