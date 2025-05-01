import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';

@Component({
  selector: 'app-acciones-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './acciones-compra.component.html',
  styleUrls: ['./acciones-compra.component.css']
})
export class AccionesCompraComponent {
  acciones = [
    { nombre: 'Apple Inc.', simbolo: 'AAPL', descripcion: 'Líder en tecnología y productos electrónicos.' },
    { nombre: 'Tesla Inc.', simbolo: 'TSLA', descripcion: 'Innovación en autos eléctricos y energía.' },
    { nombre: 'Amazon.com', simbolo: 'AMZN', descripcion: 'Gigante del comercio electrónico global.' },
    { nombre: 'Microsoft Corp.', simbolo: 'MSFT', descripcion: 'Software, servicios y tecnología empresarial.' },
    { nombre: 'Meta Platforms', simbolo: 'META', descripcion: 'Redes sociales y metaverso.' },
    { nombre: 'Alphabet (Google)', simbolo: 'GOOGL', descripcion: 'Motor de búsqueda y servicios digitales.' },
    { nombre: 'Netflix Inc.', simbolo: 'NFLX', descripcion: 'Entretenimiento por streaming.' },
    { nombre: 'Nvidia Corp.', simbolo: 'NVDA', descripcion: 'Gráficos y chips para IA.' },
    { nombre: 'Intel Corp.', simbolo: 'INTC', descripcion: 'Fabricante de procesadores global.' }
  ];

  accionSeleccionada: any = null;
  monto: number | null = null;
  plazo: number | null = null;
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;

  seleccionarAccion(accion: any) {
    this.accionSeleccionada = accion;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }

  verGraficaDesdeLista(accion: any) {
    this.accionSeleccionada = accion;
    this.mostrarGrafica = true;
    this.confirmacion = false;
  }

  confirmarInversion() {
    if (this.monto && this.plazo) {
      this.confirmacion = true;
      this.mostrarGrafica = false;
    }
  }

  cancelar() {
    this.resetear();
  }

  private resetear() {
    this.accionSeleccionada = null;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
