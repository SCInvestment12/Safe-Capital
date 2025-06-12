import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { ApuestaService, CrearApuestaRequest } from '../services/apuesta.service';
import { SaldoService } from '../services/saldo.service';
import { InversionService, CrearInversionRequest } from '../services/inversion.service';

@Component({
  selector: 'app-etfs-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './etfs-compra.component.html',
  styleUrls: ['./etfs-compra.component.css']
})
export class EtfsCompraComponent {
  etfSeleccionado: string = '';
  monto: number = 0;
  plazo: string = '';
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;
  movimientos: any[] = [];

  etfs = [
    'SPY', 'IVV', 'VOO', 'VTI', 'QQQ', 'VEA', 'AGG', 'VTV', 'BND', 'IEMG',
    'VUG', 'VNQ', 'IJH', 'VWO', 'TIP', 'LQD', 'IWM', 'DIA', 'XLF', 'XLK'
  ];

  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private apuestaService: ApuestaService,
    private saldoService: SaldoService,
    private inversionService: InversionService
  ) {}

  verGrafica(etf: string) {
    this.etfSeleccionado = etf;
    this.mostrarGrafica = true;
    this.confirmacion = false;
  }

  confirmarInversion() {
    if (!this.etfSeleccionado || !this.monto || !this.plazo) {
      this.alertService.error('Completa todos los campos.');
      return;
    }

    const ahora = new Date();
    const hora = ahora.getHours();
    const dia = ahora.getDay();
    if (dia === 0 || dia === 6 || hora < 8 || hora >= 16) {
      this.alertService.error('⏰ Solo puedes invertir en ETFs de Lunes a Viernes entre 08:00 y 16:00.');
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
      tipo: 'etfs',
      simbolo: this.etfSeleccionado,
      monto: this.monto,
      plazoDias: parseInt(this.plazo)
    };

    const apuesta: CrearApuestaRequest = {
      idUsuario,
      simbolo: this.etfSeleccionado,
      tipo: 'etfs',
      direccion: 'up',
      monto: this.monto,
      plazo: parseInt(this.plazo),
      precioActual: 0 // puedes reemplazar con el precio real si lo tienes
    };

    this.inversionService.crearInversion(inversion).subscribe({
      next: () => {
        this.apuestaService.crearApuesta(apuesta).subscribe({
          next: () => {
            this.alertService.success(`✅ Inversión registrada por $${this.monto}.`);
            this.saldoService.cargarSaldo();
            this.cargarMovimientos();
            this.confirmacion = true;
            this.mostrarGrafica = false;
          },
          error: () => {
            this.alertService.error('❌ No se pudo registrar la apuesta.');
          }
        });
      },
      error: () => {
        this.alertService.error('❌ No se pudo registrar la inversión en ETFs.');
      }
    });
  }

  private cargarMovimientos(): void {
    this.inversionService.obtenerMovimientos().subscribe({
      next: (res) => (this.movimientos = res),
      error: (err) => console.error('Error al cargar movimientos:', err)
    });
  }

  cancelar() {
    this.etfSeleccionado = '';
    this.monto = 0;
    this.plazo = '';
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
