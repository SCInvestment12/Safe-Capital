import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from '../chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../../services/dashboard.service';
import { AlertService } from '../../services/alert.service';
import { ApuestaService } from '../../services/apuesta.service';
import { SaldoService } from '../../services/saldo.service';

@Component({
  selector: 'app-forex-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './forex-compra.component.html',
  styleUrls: ['./forex-compra.component.css']
})
export class ForexCompraComponent {
  @ViewChild(ChartWrapperComponent) chartWrapper!: ChartWrapperComponent;

  paresDivisas = [
    { nombre: 'Euro / Dólar', simbolo: 'EURUSD' },
    { nombre: 'Libra / Dólar', simbolo: 'GBPUSD' },
    { nombre: 'Dólar / Yen', simbolo: 'USDJPY' },
    { nombre: 'Dólar / Franco Suizo', simbolo: 'USDCHF' },
    { nombre: 'Dólar Australiano / Dólar', simbolo: 'AUDUSD' },
    { nombre: 'Dólar Neozelandés / Dólar', simbolo: 'NZDUSD' },
    { nombre: 'Dólar / Dólar Canadiense', simbolo: 'USDCAD' }
  ];

  parSeleccionado: any = null;
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

  seleccionarPar(par: any) {
    this.resetear();
    this.parSeleccionado = par;
  }

  verGraficaDesdeLista(par: any) {
    this.resetear();
    this.parSeleccionado = par;
    this.mostrarGrafica = true;
  }

  confirmarInversion() {
    if (!this.monto || !this.plazo) {
      this.alertService.error('Ingresa monto y plazo válidos.');
      return;
    }

    this.mostrarGrafica = false;

    const req: RetirarSaldoRequest = { monto: this.monto };
    this.dashboardService.withdraw(req).subscribe({
      next: () => {
        this.saldoService.cargarSaldo(); // ✅ recarga saldo
        this.chartWrapper.lanzarApuesta('up');

        const apuesta = {
          simbolo: this.parSeleccionado.simbolo,
          tipo: 'forex',
          direccion: 'up' as 'up',
          monto: this.monto!,
          plazo: this.plazo!
        };

        this.apuestaService.crearApuesta(apuesta).subscribe({
          next: () => {
            this.alertService.success('✅ Inversión registrada.');
            this.alertService.success(`Se descontaron $${this.monto} de tu saldo.`);
            this.confirmacion = true;
          },
          error: () => {
            this.alertService.error('⚠️ Error al registrar la inversión.');
          }
        });
      },
      error: err => {
        console.error('Error al retirar saldo:', err);
        this.alertService.error('No se pudo descontar el saldo.');
      }
    });
  }

  cancelar() {
    this.resetear();
  }

  private resetear() {
    this.parSeleccionado = null;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
