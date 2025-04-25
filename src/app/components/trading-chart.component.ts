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
  ApexAnnotations
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-trading-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgApexchartsModule],
  templateUrl: './trading-chart.component.html',
  styleUrls: ['./trading-chart.component.css']
})
export class TradingChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() tipo: string = 'cetes';
  @Input() instrumento: any = null;

  chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    tooltip: ApexTooltip;
    markers: ApexMarkers;
    annotations: ApexAnnotations;
  };

  subscription!: Subscription;

  constructor(private http: HttpClient) {
    this.chartOptions = {
      series: [{ name: 'Valor', data: [] }],
      chart: {
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 300
          }
        },
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: { text: '' },
      xaxis: { categories: [] },
      tooltip: {
        enabled: true,
        theme: 'dark',
        x: {
          show: true,
          format: 'HH:mm:ss' // o 'dd MMM HH:mm' si quieres más detalle
        },
        y: {
          formatter: (value: number) => `$${value.toFixed(2)}`
        }
      },
      markers: {
        size: 5,
        colors: ['#007bff'],
        strokeColors: '#fff',
        strokeWidth: 2
      }
      ,
      annotations: { points: [] }
    };
  }

  ngOnInit(): void {
    this.chartOptions.title.text = `Gráfico de: ${this.tipo}`;
    this.obtenerDatos();
    this.subscription = interval(10000).subscribe(() => this.obtenerDatos());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instrumento'] && this.instrumento) {
      this.tipo = this.instrumento.tipo;
      this.chartOptions.title.text = `Gráfico de: ${this.instrumento.nombre}`;
      this.obtenerDatos();
    }
  }

  obtenerDatos(): void {
    this.http.get<any[]>(`http://localhost:8096/api/trading/bars/${this.tipo}`).subscribe(barras => {
      const datos = barras.map(bar => bar.close);
      const categorias = barras.map(bar => new Date(bar.timestamp).toLocaleTimeString());

      this.chartOptions.series = [{ name: 'Valor', data: datos }];
      this.chartOptions.xaxis.categories = categorias;
    });
  }

  mostrarApuesta(direccion: 'up' | 'down') {
    const index = this.chartOptions.series[0].data.length - 1;
    const valor = this.chartOptions.series[0].data[index];
    if (typeof valor !== 'number') return;

    const flecha = direccion === 'up' ? '↑' : '↓';
    const color = direccion === 'up' ? '#28a745' : '#dc3545';

    if (!this.chartOptions.annotations.points) {
      this.chartOptions.annotations.points = [];
    }

    this.chartOptions.annotations.points.push({
      x: this.chartOptions.xaxis.categories[index],
      y: valor,
      label: {
        text: flecha,
        style: {
          color: '#fff',
          background: color
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}