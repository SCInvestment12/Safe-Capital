import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-acciones-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acciones-compra.component.html',
  styleUrls: ['./acciones-compra.component.css']
})
export class AccionesCompraComponent {
  acciones = [
    { nombre: 'Apple Inc.', descripcion: 'Líder en tecnología y productos electrónicos.' },
    { nombre: 'Tesla Inc.', descripcion: 'Innovación en autos eléctricos y energía.' },
    { nombre: 'Amazon.com', descripcion: 'Gigante del comercio electrónico global.' },
    { nombre: 'Microsoft Corp.', descripcion: 'Software, servicios y tecnología empresarial.' },
    { nombre: 'Google (Alphabet)', descripcion: 'Motor de búsqueda, datos y tecnología digital.' }
  ];

  accionSeleccionada: any = null;
  monto: number | null = null;
  plazo: number | null = null;
  confirmacion: boolean = false;

  seleccionarAccion(accion: any) {
    this.accionSeleccionada = accion;
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
    alert(`Inversión confirmada:\nAcción: ${this.accionSeleccionada.nombre}\nMonto: $${this.monto}\nPlazo: ${this.plazo} días`);
    this.resetear();
  }

  cancelar() {
    this.resetear();
  }

  private resetear() {
    this.accionSeleccionada = null;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
  }
}
