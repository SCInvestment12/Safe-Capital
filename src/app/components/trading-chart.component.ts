import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexYAxis
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { TradingService, TradingBarDTO } from '../services/trading.service';

@Component({
  selector: 'app-trading-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './trading-chart.component.html',
  styleUrls: ['./trading-chart.component.css']
})
export class TradingChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() tipo: string = 'acciones';
  @Input() simbolo: string = 'TSLA';

  chartOptions!: {
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

  precioActual: number | null = null;
  private subscription!: Subscription;

  constructor(private tradingService: TradingService) {}

  ngOnInit(): void {
    this.initChart();
    this.startPolling();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['simbolo'] || changes['tipo']) {
      this.initChart();
      this.startPolling();
    }
  }

  private initChart(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
        categories: [],
        labels: { style: { colors: '#ffffff' } }
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
        x: { show: true, format: 'HH:mm:ss' },
        y: { formatter: (value: number) => `$${value.toFixed(2)}` }
      },
      markers: {
        size: 5,
        colors: ['#007bff'],
        strokeColors: '#fff',
        strokeWidth: 2
      },
      annotations: { points: [] }
    };
  }

  private startPolling(): void {
    this.subscription = interval(5000).subscribe(() => this.fetchData());
    // fetch immediately
    this.fetchData();
  }

  private fetchData(): void {
    this.tradingService
      .getBarsByTipoYSimbolo(this.tipo, this.simbolo)
      .subscribe((barras: TradingBarDTO[]) => {
        if (!barras.length) return;

        // Ordenar por timestamp
        barras.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

        const datos = barras.map(bar => bar.close);
        const categorias = barras.map(bar =>
          new Date(Date.parse(bar.timestamp)).toLocaleTimeString('es-MX', {
            timeZone: 'America/Mexico_City'
          })
        );

        this.precioActual = datos[datos.length - 1];

        this.chartOptions = {
          ...this.chartOptions,
          series: [{ name: 'Valor', data: datos }],
          xaxis: { ...this.chartOptions.xaxis, categories: categorias }
        };
      });
  }

  mostrarApuesta(direccion: 'up' | 'down'): void {
    const idx = this.chartOptions.series[0].data.length - 1;
    const valor = this.chartOptions.series[0].data[idx] as number;
    const flecha = direccion === 'up' ? '↑' : '↓';
    const color = direccion === 'up' ? '#28a745' : '#dc3545';

    this.chartOptions.annotations.points!.push({
      x: this.chartOptions.xaxis.categories[idx],
      y: valor,
      label: {
        text: flecha,
        style: { color: '#fff', background: color }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
