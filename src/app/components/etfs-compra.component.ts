import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-etfs-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etfs-compra.component.html',
  styleUrls: ['./etfs-compra.component.css']
})
export class EtfsCompraComponent {
  etfs = [
    { nombre: 'iShares S&P 500', descripcion: 'Replica el índice S&P 500 de empresas estadounidenses.' },
    { nombre: 'Vanguard Total Stock Market', descripcion: 'ETF diversificado del mercado accionario de EE.UU.' },
    { nombre: 'SPDR Dow Jones Industrial', descripcion: 'Basado en el índice Dow Jones Industrial Average.' },
    { nombre: 'Invesco QQQ', descripcion: 'Sigue el índice Nasdaq-100 con enfoque tecnológico.' },
    { nombre: 'iShares MSCI Emerging Markets', descripcion: 'Exposición a mercados emergentes globales.' }
  ];

  etfSeleccionado: any = null;
  monto: number | null = null;
  plazo: number | null = null;
  confirmacion: boolean = false;

  seleccionarEtf(etf: any) {
    this.etfSeleccionado = etf;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
  }

  confirmarInversion() {
    if (this.monto && this.plazo) {
      this.confirmacion = true;
    }
  }

  finalizar() {
    // Aquí podrías emitir un evento o hacer una llamada al backend
    alert(`Inversión confirmada:\nETF: ${this.etfSeleccionado.nombre}\nMonto: $${this.monto}\nPlazo: ${this.plazo} días`);
    this.resetear();
  }

  cancelar() {
    this.resetear();
  }

  private resetear() {
    this.etfSeleccionado = null;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
  }
}
