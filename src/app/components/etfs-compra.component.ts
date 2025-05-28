import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { ApuestaService } from '../services/apuesta.service';
import { SaldoService } from '../services/saldo.service'; // 👈 agregado

@Component({
  selector: 'app-etfs-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './etfs-compra.component.html',
  styleUrls: ['./etfs-compra.component.css']
})
export class EtfsCompraComponent {
  @ViewChild(ChartWrapperComponent) chartWrapper!: ChartWrapperComponent;

  etfs = [
    { nombre: 'iShares S&P 500', simbolo: 'SPY', descripcion: 'Replica el índice S&P 500 de empresas estadounidenses.' },
    { nombre: 'Vanguard Total Stock Market', simbolo: 'VTI', descripcion: 'ETF diversificado del mercado accionario de EE.UU.' },
    { nombre: 'SPDR Dow Jones Industrial', simbolo: 'DIA', descripcion: 'Basado en el índice Dow Jones Industrial Average.' },
    { nombre: 'Invesco QQQ', simbolo: 'QQQ', descripcion: 'Sigue el índice Nasdaq-100 con enfoque tecnológico.' },
    { nombre: 'iShares MSCI Emerging Markets', simbolo: 'EEM', descripcion: 'Exposición a mercados emergentes globales.' },
    { nombre: 'Global X MSCI China', simbolo: 'CHIQ', descripcion: 'ETF especializado en mercado chino.' },
    { nombre: 'ARK Innovation ETF', simbolo: 'ARKK', descripcion: 'ETF de innovación y tecnología disruptiva.' },
    { nombre: 'Vanguard Real Estate ETF', simbolo: 'VNQ', descripcion: 'Inversiones diversificadas en bienes raíces.' }
  ];

  etfSeleccionado: any = null;
  monto: number | null = null;
  plazo: number | null = null;
  confirmacion: boolean = false;
  mostrarGrafica: boolean = false;
  mostrarGraficaParaTodos = true;

  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private apuestaService: ApuestaService,
    private saldoService: SaldoService // 👈 agregado
  ) {}

  seleccionarEtf(etf: any) {
    this.cancelar();
    this.etfSeleccionado = etf;
  }

  verGrafica(etf: any) {
    this.cancelar();
    this.etfSeleccionado = etf;
    this.mostrarGrafica = true;
  }

  confirmarInversion() {
    if (!this.monto || !this.plazo) {
      this.alertService.error('Ingresa monto y plazo válidos.');
      return;
    }

    this.confirmacion = true;

    const req: RetirarSaldoRequest = { monto: this.monto };
    this.dashboardService.withdraw(req).subscribe({
      next: () => {
        this.alertService.success(`Se descontaron $${this.monto} de tu saldo.`);
        this.saldoService.cargarSaldo(); // 👈 actualiza saldo del navbar
        this.chartWrapper.lanzarApuesta('up'); // 👈 lanza animación

        const apuesta = {
          simbolo: this.etfSeleccionado.simbolo,
          tipo: 'etfs',
          direccion: 'up' as 'up',
          monto: this.monto!,
          plazo: this.plazo!
        };

        this.apuestaService.crearApuesta(apuesta).subscribe({
          next: () => this.alertService.success('✅ Inversión registrada correctamente.'),
          error: () => this.alertService.error('⚠️ Error al registrar la inversión.')
        });
      },
      error: err => {
        console.error('Error al retirar saldo:', err);
        this.alertService.error('No se pudo descontar el saldo.');
      }
    });
  }

  cancelar() {
    this.etfSeleccionado = null;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
