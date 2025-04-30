import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cripto-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cripto-compra.component.html',
  styleUrls: ['./cripto-compra.component.css']
})
export class CriptoCompraComponent {
  criptoSeleccionada: string = '';
  monto: number = 0;
  duracion: string = '';

  criptos = [
    { nombre: 'Bitcoin', simbolo: 'BTC' },
    { nombre: 'Ethereum', simbolo: 'ETH' },
    { nombre: 'Ripple', simbolo: 'XRP' },
    { nombre: 'Solana', simbolo: 'SOL' },
    { nombre: 'Cardano', simbolo: 'ADA' }
  ];

  seleccionarCripto(simbolo: string) {
    this.criptoSeleccionada = simbolo;
  }

  confirmarInversion() {
    if (!this.criptoSeleccionada || !this.monto || !this.duracion) {
      alert('Completa todos los campos antes de continuar.');
      return;
    }
    alert(`Has invertido $${this.monto} en ${this.criptoSeleccionada} a ${this.duracion} días.`);
  }
}
