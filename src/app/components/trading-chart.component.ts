// src/app/components/trading-chart.component.ts
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { TradingService, TradingBarDTO } from '../services/trading.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  annotations: ApexAnnotations;
};

@Component({
  selector: 'app-trading-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './trading-chart.component.html',
  styleUrls: ['./trading-chart.component.css']
})
export class TradingChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() tipo = 'acciones';
  @Input() simbolo = 'TSLA';

  public chartOptions!: ChartOptions;
  public precioActual: number | null = null;
  private subscription!: Subscription;

  constructor(private tradingService: TradingService) {}

  ngOnInit(): void {
    this.initChart();
    this.startPolling();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['simbolo'] || changes['tipo']) {
      this.subscription?.unsubscribe();
      this.initChart();
      this.startPolling();
    }
  }

  private initChart(): void {
    this.chartOptions = {
      series: [{ name: 'Valor', data: [] }],
      chart: {
        height: 400,
        type: 'line',
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 300 }
        },
        toolbar: { show: false },
        zoom: { enabled: false },
        foreColor: '#ffffff'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: { colors: '#ffffff' },
          formatter: (value: any, timestamp?: number): string => {
            const ms = typeof timestamp === 'number' ? timestamp : Number(value);
            return new Date(ms).toLocaleTimeString('es-MX', {
              timeZone: 'America/Mexico_City',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          }
        }
      },
      yaxis: {
        labels: { style: { colors: '#ffffff' } }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: {
        text: `Gráfico de: ${this.simbolo}`,
        style: { color: '#ffffff', fontSize: '16px' }
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        x: {
          formatter: (value: any, opts?: any): string => {
            const ms = opts?.timestamp ?? Number(value);
            return new Date(ms).toLocaleString('es-MX', {
              timeZone: 'America/Mexico_City',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            });
          }
        },
        y: {
          formatter: (val: number): string => `$${val.toFixed(2)}`
        }
      },
      markers: {
        size: 5,
        colors: ['#007bff'],
        strokeColors: '#fff',
        strokeWidth: 2
      },
      annotations: {
        points: []
      }
    };
  }

  private startPolling(): void {
    const frecuencia = this.tipo === 'forex' ? 3000 : 5000;
    this.subscription = interval(frecuencia).subscribe(() => this.fetchData());
    this.fetchData();
  }

  private fetchData(): void {
    this.tradingService
      .getBarsByTipoYSimbolo(this.tipo, this.simbolo)
      .subscribe((barras: TradingBarDTO[]) => {
        if (!barras.length) return;

        barras.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
        const puntos: [number, number][] = barras.map(bar => {
          const ms = new Date(bar.timestamp).getTime();
          return [ms, bar.close];
        });

        this.precioActual = puntos[puntos.length - 1][1];

        this.chartOptions = {
          ...this.chartOptions,
          series: [{ name: 'Valor', data: puntos }]
        };
      });
  }

  public mostrarApuesta(direccion: 'up' | 'down'): void {
    this.chartOptions.annotations.points =
      this.chartOptions.annotations.points || [];

    const data = this.chartOptions.series[0]?.data;
    if (!Array.isArray(data) || data.length === 0) return;

    const seriesData = data as [number, number][];
    const idx = seriesData.length - 1;
    const [x, y] = seriesData[idx];
    const flecha = direccion === 'up' ? '↑' : '↓';
    const color = direccion === 'up' ? '#28a745' : '#dc3545';

    this.chartOptions.annotations.points.push({
      x,
      y,
      label: { text: flecha, style: { color: '#fff', background: color } }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
