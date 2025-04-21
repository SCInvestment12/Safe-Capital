import { Component, Input } from '@angular/core';
import {
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
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trading-chart',
  standalone: true,
  templateUrl: './trading-chart.component.html',
  styleUrls: ['./trading-chart.component.css'],
  imports: [CommonModule, NgApexchartsModule]
})
export class TradingChartComponent {
  @Input() tipo: string = 'cetes';

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
  } = {
    series: [
      {
        name: 'Valor',
        data: [10, 15, 13, 20, 18, 25, 30]
      }
    ],
    chart: {
      height: 350,
      type: 'line'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Gráfico de: '
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    },
    tooltip: {
      enabled: true
    },
    markers: {
      size: 4
    },
    annotations: {
      points: []
    }
  };

  ngOnInit(): void {
    this.chartOptions.title.text = `Gráfico de: ${this.tipo}`;
  }

  mostrarApuesta(direccion: 'up' | 'down') {
    const index = this.chartOptions.series[0].data.length - 1;
    const valor = this.chartOptions.series[0].data[index];
  
    if (typeof valor !== 'number') return;
  
    const flecha = direccion === 'up' ? '↑' : '↓';
    const color = direccion === 'up' ? '#28a745' : '#dc3545';
  
    // Validar que annotations.points exista
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
}
  
