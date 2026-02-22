import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../core/models/product.models';
import { ProductService } from '../../../../../core/services/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailComponent } from '../../../../user/components/article-detail/product-detail.component';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'listPrice', 'subCategoryName', 'actions'];

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('ArticleListComponent: Initialisation...');
    this.productService.getAll().subscribe({
      next: (products) => {
        console.log('ArticleListComponent: Produits reçus:', products);
        this.products = products;
      },
      error: (err) => {
        console.error('ArticleListComponent: Erreur lors de la récupération des produits:', err);
      }
    });
  }

  viewProduct(id: number): void {
    this.dialog.open(ProductDetailComponent, {
      width: '800px',
      data: { id }
    });
  }

  editArticle(id: number): void {
    this.router.navigate(['/admin/articles', id, 'edit']);
  }

  deleteArticle(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.productService.delete(id).subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
      });
    }
  }
}
