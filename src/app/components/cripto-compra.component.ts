import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';

@Component({
  selector: 'app-cripto-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './cripto-compra.component.html',
  styleUrls: ['./cripto-compra.component.css']
})
export class CriptoCompraComponent {
  criptoSeleccionada: string = '';
  monto: number = 0;
  duracion: string = '';
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;

  criptos = [
    { nombre: 'Bitcoin', simbolo: 'BTC' },
    { nombre: 'Ethereum', simbolo: 'ETH' },
    { nombre: 'Ripple', simbolo: 'XRP' },
    { nombre: 'Solana', simbolo: 'SOL' },
    { nombre: 'Cardano', simbolo: 'ADA' },
    { nombre: 'Polkadot', simbolo: 'DOT' },
    { nombre: 'Dogecoin', simbolo: 'DOGE' },
    { nombre: 'Avalanche', simbolo: 'AVAX' },
    { nombre: 'Litecoin', simbolo: 'LTC' },
    { nombre: 'Chainlink', simbolo: 'LINK' },
    { nombre: 'Shiba Inu', simbolo: 'SHIB' },
    { nombre: 'Stellar', simbolo: 'XLM' },
    { nombre: 'Uniswap', simbolo: 'UNI' },
    { nombre: 'Aave', simbolo: 'AAVE' },
    { nombre: 'Cosmos', simbolo: 'ATOM' },
    { nombre: 'VeChain', simbolo: 'VET' },
    { nombre: 'Algorand', simbolo: 'ALGO' },
    { nombre: 'Tezos', simbolo: 'XTZ' },
    { nombre: 'The Sandbox', simbolo: 'SAND' },
    { nombre: 'Filecoin', simbolo: 'FIL' }
  ];

  mostrarBotonGrafica(): boolean {
    const index = this.criptos.findIndex(c => c.simbolo === this.criptoSeleccionada);
    return index > -1 && (index < 5 || true);
  }

  verGrafica() {
    this.mostrarGrafica = true;
    this.confirmacion = false;
  }

  confirmarInversion() {
    if (!this.criptoSeleccionada || !this.monto || !this.duracion) return;
    this.confirmacion = true;
    this.mostrarGrafica = false;
  }

  reiniciar() {
    this.criptoSeleccionada = '';
    this.monto = 0;
    this.duracion = '';
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
