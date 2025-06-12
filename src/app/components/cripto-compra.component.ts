import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { SaldoService } from '../services/saldo.service';
import { InversionService, CrearInversionRequest, CrearApuestaRequest } from '../services/inversion.service'; // ✅ Incluye CrearApuestaRequest aquí

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
  movimientos: any[] = [];
precioActual: number = 0;

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
    private saldoService: SaldoService,
    private inversionService: InversionService
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
      next: () => this.procesarInversion(),
      error: (err) => {
        if (err?.status === 200 || err?.ok === false) {
          this.procesarInversion();
        } else {
          this.alertService.error('No se pudo descontar el saldo.');
        }
      }
    });
  }

  private procesarInversion(): void {
    const idUsuario = +(localStorage.getItem('id') || '0');

    const inversion: CrearInversionRequest = {
      idUsuario,
      tipo: 'cripto',
      simbolo: this.criptoSeleccionada,
      monto: this.monto,
      plazoDias: parseInt(this.duracion)
    };

    const apuesta: CrearApuestaRequest = {
  idUsuario,
  simbolo: this.criptoSeleccionada,
  tipo: 'cripto',
  direccion: 'up',
  monto: this.monto,
  plazo: parseInt(this.duracion),
  precioActual: this.precioActual // ✅ Este campo es requerido por el backend
};


    this.inversionService.crearInversion(inversion).subscribe({
      next: () => console.log('Inversión cripto registrada'),
      error: () => console.error('❌ No se pudo guardar la inversión cripto')
    });

    this.inversionService.crearApuesta(apuesta).subscribe({
      next: () => {
        this.alertService.success(`✅ Inversión registrada por $${this.monto}.`);
        this.saldoService.cargarSaldo();
        this.cargarMovimientos();
        this.confirmacion = true;
        this.mostrarGrafica = false;
      },
      
    });

    this.alertService.success(`✅ Se descontaron $${this.monto} de tu saldo.`);
  }

  private cargarMovimientos(): void {
    this.inversionService.obtenerMovimientos().subscribe({
      next: (res) => this.movimientos = res,
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
