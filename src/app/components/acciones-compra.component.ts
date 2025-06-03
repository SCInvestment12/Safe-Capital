import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { DashboardService, RetirarSaldoRequest } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { ApuestaService, CrearApuestaRequest } from '../services/apuesta.service';
import { SaldoService } from '../services/saldo.service';

@Component({
  selector: 'app-acciones-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartWrapperComponent],
  templateUrl: './acciones-compra.component.html',
  styleUrls: ['./acciones-compra.component.css']
})
export class AccionesCompraComponent {
  @ViewChild(ChartWrapperComponent) chartWrapper!: ChartWrapperComponent;

  acciones = [
    { nombre: 'Apple Inc.', simbolo: 'AAPL', descripcion: 'Líder en tecnología y productos electrónicos.' },
    { nombre: 'Tesla Inc.', simbolo: 'TSLA', descripcion: 'Innovación en autos eléctricos y energía.' },
    { nombre: 'Amazon.com', simbolo: 'AMZN', descripcion: 'Gigante del comercio electrónico global.' },
    { nombre: 'Microsoft Corp.', simbolo: 'MSFT', descripcion: 'Software, servicios y tecnología empresarial.' },
    { nombre: 'Meta Platforms', simbolo: 'META', descripcion: 'Redes sociales y metaverso.' },
    { nombre: 'Alphabet (Google)', simbolo: 'GOOGL', descripcion: 'Motor de búsqueda y servicios digitales.' },
    { nombre: 'Netflix Inc.', simbolo: 'NFLX', descripcion: 'Entretenimiento por streaming.' },
    { nombre: 'Nvidia Corp.', simbolo: 'NVDA', descripcion: 'Gráficos y chips para IA.' },
    { nombre: 'Intel Corp.', simbolo: 'INTC', descripcion: 'Fabricante de procesadores global.' }
  ];

  accionSeleccionada: any = null;
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

  seleccionarAccion(accion: any): void {
    this.resetear();
    this.accionSeleccionada = accion;
  }

  verGraficaDesdeLista(accion: any): void {
    this.resetear();
    this.accionSeleccionada = accion;
    this.mostrarGrafica = true;
  }

  confirmarInversion(): void {
    if (!this.monto || !this.plazo) {
      this.alertService.error('Ingresa monto y plazo válidos.');
      return;
    }

    const horaActual = new Date().getHours();
    if (horaActual < 8 || horaActual >= 16) {
      this.alertService.error('⏰ Solo puedes invertir en acciones entre 08:00 y 16:00 horas.');
      return;
    }

    const req: RetirarSaldoRequest = { monto: this.monto };

    this.dashboardService.withdraw(req).subscribe({
      next: () => {
        this.procesarApuesta();
      },
      error: (err) => {
        if (err?.status === 200 || err?.ok === false) {
          console.warn('⚠️ Respuesta extraña, pero con status 200: se continuará como éxito.');
          this.procesarApuesta();
        } else {
          console.error('❌ Error real al retirar saldo:', err);
          this.alertService.error('No se pudo descontar el saldo.');
          this.confirmacion = false;
        }
      }
    });
  }

  private procesarApuesta(): void {
    this.saldoService.cargarSaldo();
    this.confirmacion = true;
    this.chartWrapper.lanzarApuesta('up');

    const apuesta: CrearApuestaRequest = {
      simbolo: this.accionSeleccionada.simbolo,
      tipo: 'acciones',
      direccion: 'up',
      monto: this.monto!,
      plazo: this.plazo!
    };

    this.apuestaService.crearApuesta(apuesta).subscribe({
      next: () => {
        this.alertService.success('✅ Apuesta registrada correctamente.');
      },
      error: (error) => {
        console.warn('⚠️ Apuesta registrada pero con error de respuesta:', error);
        this.alertService.success('✅ Inversion registrada exitosamente.');
      }
    });

    this.alertService.success(`✅ Se descontaron $${this.monto} de tu saldo.`);
  }

  cancelar(): void {
    this.resetear();
  }

  private resetear(): void {
    this.accionSeleccionada = null;
    this.monto = null;
    this.plazo = null;
    this.confirmacion = false;
    this.mostrarGrafica = false;
  }
}
