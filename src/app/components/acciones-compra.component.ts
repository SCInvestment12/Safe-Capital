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
  selector: 'app-acciones-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './acciones-compra.component.html',
  styleUrls: ['./acciones-compra.component.css']
})
export class AccionesCompraComponent {
  accionSeleccionada: string = '';
  monto: number = 0;
  plazo: string = '';
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;
  movimientos: any[] = [];
  precioActual: number = 0; // ✅ NECESARIO

  acciones = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRK.B', 'JNJ', 'V',
    'UNH', 'HD', 'PG', 'JPM', 'MA', 'XOM', 'BAC', 'DIS', 'VZ', 'ADBE'
  ];

  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private apuestaService: ApuestaService,
    private saldoService: SaldoService,
    private inversionService: InversionService
  ) {}

  verGraficaDesdeLista(simbolo: string) {
    this.accionSeleccionada = simbolo;
    this.mostrarGrafica = true;
    this.confirmacion = false;
  }

  confirmarInversion() {
    if (!this.accionSeleccionada || !this.monto || !this.plazo) {
      this.alertService.error('Completa todos los campos.');
      return;
    }

    const ahora = new Date();
    const hora = ahora.getHours();
    const dia = ahora.getDay();
    if (dia === 0 || dia === 6 || hora < 8 || hora >= 16) {
      this.alertService.error('⏰ Solo puedes invertir en Acciones de Lunes a Viernes entre 08:00 y 16:00.');
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
    const idUsuario = +(localStorage.getItem('id') || '0');
    const inversion: CrearInversionRequest = {
      idUsuario,
      tipo: 'acciones',
      simbolo: this.accionSeleccionada,
      monto: this.monto,
      plazoDias: parseInt(this.plazo)
    };

    this.inversionService.crearInversion(inversion).subscribe({
      next: () => {
        const apuesta: CrearApuestaRequest = {
          idUsuario,
          simbolo: this.accionSeleccionada,
          tipo: 'acciones',
          direccion: 'up',
          monto: this.monto,
          plazo: parseInt(this.plazo),
          precioActual: this.precioActual // ✅ necesario para el backend
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
            this.alertService.error('❌ No se pudo registrar la apuesta.');
          }
        });
      },
      error: () => {
        this.alertService.error(`❌ No se pudo registrar la inversión en Acciones.`);
      }
    });

    this.alertService.success(`✅ Se descontaron $${this.monto} de tu saldo.`);
  }

  private cargarMovimientos(): void {
    this.inversionService.obtenerMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        console.log('Movimientos:', this.movimientos);
      },
      error: () => {
        this.alertService.error('No se pudieron cargar los movimientos.');
      }
    });
  }

  cancelar() {
    this.accionSeleccionada = '';
    this.monto = 0;
    this.plazo = '';
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
