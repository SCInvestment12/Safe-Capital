import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from '../chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../../services/dashboard.service';
import { AlertService } from '../../services/alert.service';
import { ApuestaService, CrearApuestaRequest } from '../../services/apuesta.service';
import { SaldoService } from '../../services/saldo.service';
import { InversionService, CrearInversionRequest } from '../../services/inversion.service';

interface ParDivisa {
  nombre: string;
  simbolo: string;
}

@Component({
  selector: 'app-forex-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './forex-compra.component.html',
  styleUrls: ['./forex-compra.component.css']
})
export class ForexCompraComponent {
  @ViewChild(ChartWrapperComponent) chartWrapper!: ChartWrapperComponent;

  paresDivisas: ParDivisa[] = [
    { nombre: 'Euro / Dólar Estadounidense', simbolo: 'EURUSD' },
    { nombre: 'Libra Esterlina / Dólar Estadounidense', simbolo: 'GBPUSD' },
    { nombre: 'Dólar Estadounidense / Yen Japonés', simbolo: 'USDJPY' },
    { nombre: 'Dólar Canadiense / Franco Suizo', simbolo: 'CADCHF' },
    { nombre: 'Dólar Australiano / Dólar Estadounidense', simbolo: 'AUDUSD' }
  ];

  parSeleccionado: ParDivisa | null = null;
  monto: number | null = null;
  duracion: string = '';
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private apuestaService: ApuestaService,
    private saldoService: SaldoService,
    private inversionService: InversionService
  ) {}

  seleccionarPar(par: ParDivisa): void {
    this.resetear();
    this.parSeleccionado = par;
  }

  verGraficaDesdeLista(par: ParDivisa): void {
    this.parSeleccionado = par;
    this.mostrarGrafica = true;
  }

  confirmarInversion(): void {
    if (!this.monto || !this.parSeleccionado || !this.duracion) {
      this.alertService.error('Completa todos los campos para invertir.');
      return;
    }

    const ahora = new Date();
    const hora = ahora.getHours();
    const dia = ahora.getDay();
    if (dia === 0 || dia === 6 || hora < 8 || hora >= 20) {
      this.alertService.error('⏰ Solo puedes invertir en Forex de Lunes a Viernes entre 08:00 y 20:00.');
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
    if (!this.parSeleccionado || !this.monto || !this.duracion) return;

    const idUsuario = +(localStorage.getItem('id') || '0');
    const inversion: CrearInversionRequest = {
      idUsuario,
      tipo: 'forex',
      simbolo: this.parSeleccionado.simbolo,
      monto: this.monto,
      plazoDias: parseInt(this.duracion)
    };

    this.inversionService.crearInversion(inversion).subscribe({
      next: () => {
        const apuesta: CrearApuestaRequest = {
          simbolo: this.parSeleccionado!.simbolo,
          tipo: 'forex',
          direccion: 'up',
          monto: this.monto!,
          plazo: parseInt(this.duracion)
        };

        this.apuestaService.crearApuesta(apuesta).subscribe();
        this.chartWrapper?.lanzarApuesta('up');
        this.confirmacion = true;
        this.saldoService.cargarSaldo();
        this.cargarMovimientos();
        this.alertService.success(`✅ Inversión registrada por $${this.monto}.`);
      },
      error: () => {
        this.alertService.error('No se pudo registrar la inversión.');
      }
    });
  }

  private cargarMovimientos(): void {
    this.inversionService.obtenerMovimientos().subscribe({
      next: (res) => console.log('Movimientos actualizados (Forex):', res),
      error: (err) => console.error('Error al cargar movimientos (Forex):', err)
    });
  }

  cancelar(): void {
    this.resetear();
  }

  private resetear(): void {
    this.parSeleccionado = null;
    this.monto = null;
    this.duracion = '';
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}