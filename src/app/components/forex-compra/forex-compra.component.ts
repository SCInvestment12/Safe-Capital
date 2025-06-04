import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from '../chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../../services/dashboard.service';
import { AlertService } from '../../services/alert.service';
import { ApuestaService, CrearApuestaRequest } from '../../services/apuesta.service';
import { SaldoService } from '../../services/saldo.service';

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
    { nombre: 'Dólar Australiano / Dólar Estadounidense', simbolo: 'AUDUSD' },
  ];

  parSeleccionado: ParDivisa | null = null;
  monto: number | null = null;
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private apuestaService: ApuestaService,
    private saldoService: SaldoService
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
    if (!this.monto || !this.parSeleccionado) {
      this.alertService.error('Completa los campos para invertir.');
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
    if (!this.parSeleccionado) return;

    const apuesta: CrearApuestaRequest = {
      simbolo: this.parSeleccionado.simbolo,
      tipo: 'forex',
      direccion: 'up',
      monto: this.monto!,
      plazo: 60 // fijo por ahora
    };

    this.apuestaService.crearApuesta(apuesta).subscribe();
    this.chartWrapper?.lanzarApuesta('up');
    this.confirmacion = true;
    this.saldoService.cargarSaldo();
    this.cargarMovimientos();
  }

  private cargarMovimientos(): void {
    const userId = +(localStorage.getItem('id') || '0');
    this.dashboardService.getTransactions(userId).subscribe();
  }

  cancelar(): void {
    this.resetear();
  }

  private resetear(): void {
    this.parSeleccionado = null;
    this.monto = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
