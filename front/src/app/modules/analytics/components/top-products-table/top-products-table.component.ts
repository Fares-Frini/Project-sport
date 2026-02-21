import { Component, Input, OnInit } from '@angular/core';
import { ProductSales } from '../../../../core/models/analytics.models';

@Component({
  selector: 'app-top-products-table',
  templateUrl: './top-products-table.component.html',
  styleUrls: ['./top-products-table.component.scss']
})
export class TopProductsTableComponent implements OnInit {
  @Input() products: ProductSales[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}
