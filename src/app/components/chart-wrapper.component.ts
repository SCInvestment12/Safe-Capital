// src/app/components/chart-wrapper.component.ts
import {
  Component,
  Inject,
  Input,
  PLATFORM_ID,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TradingChartComponent } from './trading-chart.component';

@Component({
  selector: 'app-chart-wrapper',
  standalone: true,
  imports: [CommonModule, TradingChartComponent],
  template: `
    <ng-container *ngIf="isBrowser && tipo !== 'cetes' && simbolo">
      <app-trading-chart
        #chart
        [tipo]="tipo"
        [simbolo]="simboloFormateado">
      </app-trading-chart>
    </ng-container>
  `
})
export class ChartWrapperComponent implements OnChanges {
  @Input() tipo = '';
  @Input() simbolo = '';

  simboloFormateado = '';
  isBrowser: boolean;

  @ViewChild('chart', { static: false })
  chartComponent?: TradingChartComponent;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Esquivamos la restricción con un cast a any
    const cs = changes as any;
    const cambioSimbolo = cs.simbolo as SimpleChanges[string];
    const cambioTipo    = cs.tipo    as SimpleChanges[string];

    if (cambioSimbolo || cambioTipo) {
      this.simboloFormateado =
        this.tipo === 'forex'
          ? this.simbolo.replace('/', '')
          : this.simbolo;
    }
  }

  lanzarApuesta(direccion: 'up' | 'down') {
    this.chartComponent?.mostrarApuesta(direccion);
  }
}
