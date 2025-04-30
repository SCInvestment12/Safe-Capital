import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cetes-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cetes-compra.component.html',
  styleUrls: ['./cetes-compra.component.css']
})
export class CetesCompraComponent {
  plazos = [
    { plazo: '1 mes', tasa: '8.80%' },
    { plazo: '3 meses', tasa: '8.60%' },
    { plazo: '6 meses', tasa: '8.42%' },
    { plazo: '12 meses', tasa: '8.37%' },
    { plazo: '2 años', tasa: '8.70%' }
  ];

  plazoSeleccionado: any = null;
  confirmar = false;

  seleccionar(plazo: any) {
    this.plazoSeleccionado = plazo;
    this.confirmar = false;
  }

  continuarCompra() {
    this.confirmar = true;
  }

  reiniciar() {
    this.plazoSeleccionado = null;
    this.confirmar = false;
  }
}
