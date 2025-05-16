import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from '../chart-wrapper.component';

@Component({
  selector: 'app-forex-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './forex-compra.component.html',
  styleUrls: ['./forex-compra.component.css']
})
export class ForexCompraComponent {
  paresDivisas = [
    { nombre: 'Euro / Dólar', simbolo: 'EUR/USD' },
    { nombre: 'Libra / Dólar', simbolo: 'GBP/USD' },
    { nombre: 'Dólar / Yen', simbolo: 'USD/JPY' },
    { nombre: 'Dólar / Franco Suizo', simbolo: 'USD/CHF' },
    { nombre: 'Dólar Australiano / Dólar', simbolo: 'AUD/USD' },
    { nombre: 'Dólar Neozelandés / Dólar', simbolo: 'NZD/USD' },
    { nombre: 'Dólar / Dólar Canadiense', simbolo: 'USD/CAD' }
  ];

  parSeleccionado: any = null;
  monto: number | null = null;
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;

  seleccionarPar(par: any) {
    this.parSeleccionado = par;
    this.monto = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }

  verGraficaDesdeLista(par: any) {
    this.parSeleccionado = par;
    this.mostrarGrafica = true;
    this.confirmacion = false;
  }

  confirmarInversion() {
    if (this.monto) {
      this.confirmacion = true;
      this.mostrarGrafica = false;
    }
  }

  cancelar() {
    this.resetear();
  }

  private resetear() {
    this.parSeleccionado = null;
    this.monto = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
