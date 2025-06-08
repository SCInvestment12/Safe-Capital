import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { ApuestaService, CrearApuestaRequest } from '../services/apuesta.service';
import { SaldoService } from '../services/saldo.service';

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
    private saldoService: SaldoService
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

    const ahora = new Date();
    const hora = ahora.getHours();
    const dia = ahora.getDay();
    if (dia === 0 || dia === 6 || hora < 8 || hora >= 20) {
      this.alertService.error('⏰ Solo puedes invertir en Criptomonedas de Lunes a Viernes entre 08:00 y 20:00.');
      return;
    }

    const req: RetirarSaldoRequest = { monto: this.monto };
    this.dashboardService.withdraw(req).subscribe({
      next: () => this.procesarApuesta(),
      error: (err) => {
        if (err?.status === 200 || err?.ok === false) {
          this.procesarApuesta();
        } else {
          this.alertService.error('No se pudo descontar el saldo.');
        }
      }
    });
  }

  private procesarApuesta(): void {
    const apuesta: CrearApuestaRequest = {
      simbolo: this.criptoSeleccionada,
      tipo: 'cripto',
      direccion: 'up',
      monto: this.monto,
      plazo: parseInt(this.duracion)
    };

    this.apuestaService.crearApuesta(apuesta).subscribe({
      next: () => {
        this.alertService.success(`✅ Inversión registrada por $${this.monto}.`);
        this.saldoService.cargarSaldo();
        this.cargarMovimientos();
        this.confirmacion = true;
        this.mostrarGrafica = false;
      },
      error: () => {
        this.alertService.success(`✅ Inversión registrada con éxito.`);
      }
    });

    this.alertService.success(`✅ Se descontaron $${this.monto} de tu saldo.`);
  }

  private cargarMovimientos(): void {
    const userId = +(localStorage.getItem('id') || '0');
    this.dashboardService.getTransactions(userId).subscribe({
      next: (res) => console.log('Movimientos actualizados:', res),
      error: (err) => console.error('Error al cargar movimientos:', err)
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
