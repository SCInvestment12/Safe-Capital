import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { ApuestaService, CrearApuestaRequest } from '../services/apuesta.service';
import { SaldoService } from '../services/saldo.service';

interface Etf {
  nombre: string;
  simbolo: string;
  descripcion: string;
}

@Component({
  selector: 'app-etfs-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './etfs-compra.component.html',
  styleUrls: ['./etfs-compra.component.css']
})
export class EtfsCompraComponent {
  @ViewChild(ChartWrapperComponent) chartWrapper!: ChartWrapperComponent;

  etfs: Etf[] = [
    { nombre: 'iShares S&P 500', simbolo: 'SPY', descripcion: 'Replica el índice S&P 500 de empresas estadounidenses.' },
    { nombre: 'Vanguard Total Stock Market', simbolo: 'VTI', descripcion: 'Incluye la mayoría de las acciones del mercado estadounidense.' },
    { nombre: 'iShares MSCI Emerging Markets', simbolo: 'EEM', descripcion: 'Rastrea mercados emergentes globales.' },
    { nombre: 'Invesco QQQ Trust', simbolo: 'QQQ', descripcion: 'Representa las principales acciones tecnológicas del NASDAQ.' },
    { nombre: 'SPDR Dow Jones Industrial Average', simbolo: 'DIA', descripcion: 'Replica el índice Dow Jones Industrial.' },
    { nombre: 'Vanguard FTSE Developed Markets', simbolo: 'VEA', descripcion: 'Cubre mercados desarrollados fuera de EE.UU.' }
  ];

  etfSeleccionado: Etf | null = null;
  monto: number | null = null;
  plazo: number | null = null;
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private apuestaService: ApuestaService,
    private saldoService: SaldoService
  ) {}

  seleccionarEtf(etf: Etf): void {
    this.resetear();
    this.etfSeleccionado = etf;
  }

  verGrafica(etf: Etf): void {
    this.resetear();
    this.etfSeleccionado = etf;
    this.mostrarGrafica = true;
  }

  confirmarInversion(): void {
    if (!this.monto || !this.plazo || !this.etfSeleccionado) {
      this.alertService.error('Ingresa todos los campos.');
      return;
    }

    const hora = new Date().getHours();
    if (hora < 8 || hora >= 16) {
      this.alertService.error('⏰ Solo puedes invertir en ETFs entre 08:00 y 16:00 hrs.');
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
    if (!this.etfSeleccionado) return;

    const apuesta: CrearApuestaRequest = {
      simbolo: this.etfSeleccionado.simbolo,
      tipo: 'etfs',
      direccion: 'up',
      monto: this.monto!,
      plazo: this.plazo!
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
    this.etfSeleccionado = null;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
