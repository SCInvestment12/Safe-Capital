import { Component, Inject, Input, PLATFORM_ID, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TradingChartComponent } from './trading-chart.component';

@Component({
  selector: 'app-chart-wrapper',
  standalone: true,
  template: `
    <ng-container *ngIf="isBrowser && tipo !== 'cetes' && simbolo">
      <app-trading-chart
        #chart
        [tipo]="tipo"
        [simbolo]="simboloFormateado">
      </app-trading-chart>
    </ng-container>
  `,
  imports: [CommonModule, TradingChartComponent]
})
export class ChartWrapperComponent implements OnChanges {
  @Input() tipo: string = '';
  @Input() simbolo: string = '';

  simboloFormateado: string = '';

  isBrowser: boolean;
  @ViewChild('chart', { static: false }) chartComponent: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.simboloFormateado =
      this.tipo === 'forex' ? this.simbolo.replace('/', '') : this.simbolo;
  }

  lanzarApuesta(direccion: 'up' | 'down') {
    if (this.chartComponent?.mostrarApuesta) {
      this.chartComponent.mostrarApuesta(direccion);
    }
  }
}
