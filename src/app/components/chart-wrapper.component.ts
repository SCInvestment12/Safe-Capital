// src/app/components/chart-wrapper.component.ts
import {
  Component,
  Inject,
  Input,
  Output,
  EventEmitter,
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
      <div class="full-width-chart">
        <app-trading-chart
          #chart
          [tipo]="tipo"
          [simbolo]="simboloFormateado"
          [precioCompra]="precioCompra"
          [precioVenta]="precioVenta"
          (precioActualCambiado)="emitirPrecioActual($event)"
        ></app-trading-chart>
      </div>
    </ng-container>
  `,
  styleUrls: ['./chart-wrapper.component.css']
})
export class ChartWrapperComponent implements OnChanges {
  @Input() tipo = '';
  @Input() simbolo = '';
  @Input() precioCompra: number | null = null;
  @Input() precioVenta: number | null = null;

  @Output() precioActualCambiado = new EventEmitter<number>();

  simboloFormateado = '';
  isBrowser: boolean;

  @ViewChild('chart', { static: false })
  chartComponent?: TradingChartComponent;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cambioSimbolo = changes['simbolo'];
    const cambioTipo = changes['tipo'];

    if (cambioSimbolo || cambioTipo) {
      this.simboloFormateado =
        this.tipo === 'forex' ? this.simbolo.replace('/', '') : this.simbolo;
    }
  }

  emitirPrecioActual(precio: number) {
    this.precioActualCambiado.emit(precio);
  }

  lanzarApuesta(direccion: 'up' | 'down') {
    this.chartComponent?.mostrarApuesta(direccion);
  }
}
