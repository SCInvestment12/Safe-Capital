import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { ApuestaService } from '../services/apuesta.service';
import { SaldoService } from '../services/saldo.service'; // ✅ agregado

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

  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private apuestaService: ApuestaService,
    private saldoService: SaldoService // ✅ agregado
  ) {}

  mostrarBotonGrafica(): boolean {
    return this.criptos.some(c => c.simbolo === this.criptoSeleccionada);
  }

  verGrafica() {
    this.mostrarGrafica = true;
    this.confirmacion = false;
  }

  confirmarInversion() {
    if (!this.criptoSeleccionada || !this.monto || !this.duracion) {
      this.alertService.error('Completa todos los campos.');
      return;
    }

    this.confirmacion = true;
    this.mostrarGrafica = false;

    const req: RetirarSaldoRequest = { monto: this.monto };
    this.dashboardService.withdraw(req).subscribe({
      next: () => {
        this.alertService.success(`Se descontaron $${this.monto} de tu saldo.`);
        this.saldoService.cargarSaldo(); // ✅ actualizar saldo en navbar

        const apuesta = {
          simbolo: this.criptoSeleccionada,
          tipo: 'cripto',
          direccion: 'up' as 'up',
          monto: this.monto,
          plazo: parseInt(this.duracion)
        };

        this.apuestaService.crearApuesta(apuesta).subscribe({
          next: () => this.alertService.success('✅ Inversión registrada.'),
          error: () => this.alertService.error('⚠️ Error al registrar la inversión.')
        });
      },
      error: err => {
        console.error('Error al retirar saldo:', err);
        this.alertService.error('No se pudo descontar el saldo.');
      }
    });
  }

  reiniciar() {
    this.criptoSeleccionada = '';
    this.monto = 0;
    this.duracion = '';
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
