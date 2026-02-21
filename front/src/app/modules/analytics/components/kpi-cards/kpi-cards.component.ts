import { Component, Input } from '@angular/core';
import { GlobalKPIs } from '../../../../core/models/analytics.models';

@Component({
  selector: 'app-kpi-cards',
  templateUrl: './kpi-cards.component.html',
  styleUrls: ['./kpi-cards.component.scss']
})
export class KpiCardsComponent {
  @Input() kpis: GlobalKPIs | null = null;
}
