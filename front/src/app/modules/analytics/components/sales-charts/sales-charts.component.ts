import { Component, Input, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, registerables, ChartType, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-sales-charts',
  templateUrl: './sales-charts.component.html',
  styleUrls: ['./sales-charts.component.scss']
})
export class SalesChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() type: ChartType = 'bar';
  @Input() data: any = {};
  @Input() options: any = {};

  private chart: Chart | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.data && this.data.labels) {
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: this.options.legend !== false,
            position: this.options.legendPosition || 'top',
          }
        },
        ...this.options
      }
    };

    if (this.chartCanvas) {
      this.chart = new Chart(this.chartCanvas.nativeElement, config);
    }
  }
}
