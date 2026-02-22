import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../core/models/product.models';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: false // Forced refresh for IDE
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  isModal = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    @Optional() public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.isModal = !!dialogRef;
  }

  ngOnInit(): void {
    const id = this.data?.id || this.route.snapshot.params['id'];
    if (id) {
      this.productService.getById(id).subscribe(product => {
        this.product = product;
      });
    }
  }
}
