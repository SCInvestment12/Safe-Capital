import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';

@Component({
  selector: 'app-etfs-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './etfs-compra.component.html',
  styleUrls: ['./etfs-compra.component.css']
})
export class EtfsCompraComponent {
  etfs = [
    { nombre: 'iShares S&P 500', simbolo: 'SPY', descripcion: 'Replica el índice S&P 500 de empresas estadounidenses.' },
    { nombre: 'Vanguard Total Stock Market', simbolo: 'VTI', descripcion: 'ETF diversificado del mercado accionario de EE.UU.' },
    { nombre: 'SPDR Dow Jones Industrial', simbolo: 'DIA', descripcion: 'Basado en el índice Dow Jones Industrial Average.' },
    { nombre: 'Invesco QQQ', simbolo: 'QQQ', descripcion: 'Sigue el índice Nasdaq-100 con enfoque tecnológico.' },
    { nombre: 'iShares MSCI Emerging Markets', simbolo: 'EEM', descripcion: 'Exposición a mercados emergentes globales.' },
    { nombre: 'Global X MSCI China', simbolo: 'CHIQ', descripcion: 'ETF especializado en mercado chino.' },
    { nombre: 'ARK Innovation ETF', simbolo: 'ARKK', descripcion: 'ETF de innovación y tecnología disruptiva.' },
    { nombre: 'Vanguard Real Estate ETF', simbolo: 'VNQ', descripcion: 'Inversiones diversificadas en bienes raíces.' }
  ];

  etfSeleccionado: any = null;
  monto: number | null = null;
  plazo: number | null = null;
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;
  mostrarGraficaParaTodos = true;

  seleccionarEtf(etf: any) {
    this.etfSeleccionado = etf;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }

  verGrafica(etf: any) {
    this.etfSeleccionado = etf;
    this.mostrarGrafica = true;
  }

  confirmarInversion() {
    if (this.monto && this.plazo) {
      this.confirmacion = true;
    }
  }

  cancelar() {
    this.etfSeleccionado = null;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
