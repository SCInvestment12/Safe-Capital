import { Component, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TradingChartComponent } from './trading-chart.component'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-chart-wrapper',
  standalone: true,
  template: `
    <ng-container *ngIf="isBrowser">
      <app-trading-chart #chart [tipo]="tipo"></app-trading-chart>
    </ng-container>
  `,
  imports: [CommonModule, TradingChartComponent]
})
export class ChartWrapperComponent {
  @Input() tipo: string = 'cetes';
  isBrowser: boolean;

  @ViewChild('chart', { static: false }) chartComponent: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  lanzarApuesta(direccion: 'up' | 'down') {
    if (this.chartComponent?.mostrarApuesta) {
      this.chartComponent.mostrarApuesta(direccion);
    }
  }
}
