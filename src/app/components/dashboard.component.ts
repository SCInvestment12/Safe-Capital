import { Component, ViewChild } from '@angular/core';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { CommonModule } from '@angular/common';
import { Top5InstrumentosComponent } from '../components/top5-instrumentos/top5-instrumentos.component';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, ChartWrapperComponent, Top5InstrumentosComponent, FormsModule]
})
export class DashboardComponent {
  tipo = 'cetes';
  instrumentoSeleccionado: any = null;
  duracion = 30000; // 30 segundos
  montoPorApuesta = 100;
  tiposActivos: string[] = ['cetes', 'cripto', 'etfs', 'acciones'];
  tipoActivoSeleccionado: string = 'cetes';
  apuestaActiva: boolean = false;

  historial: {
    direccion: string;
    resultado: string;
    timestamp: string;
  }[] = [];

  saldo: number = 0;
  isCuentaDemo: boolean = true;
  mostrarModal: boolean = false;

  @ViewChild(ChartWrapperComponent) chartWrapper!: ChartWrapperComponent;

  constructor(private alertService: AlertService) {
    const historialGuardado = localStorage.getItem('historial');
    const saldoGuardado = localStorage.getItem('saldo');
    const demoGuardado = localStorage.getItem('isCuentaDemo');

    if (historialGuardado) {
      this.historial = JSON.parse(historialGuardado);
    }

    if (saldoGuardado) {
      this.saldo = parseFloat(saldoGuardado);
    }

    if (demoGuardado) {
      this.isCuentaDemo = demoGuardado === 'true';
    }
  }

  apostar(direccion: 'up' | 'down') {
    if (this.apuestaActiva) {
      this.alertService.error('Ya tienes una apuesta activa.');
      return;
    }

    if (this.saldo < this.montoPorApuesta && !this.isCuentaDemo) {
      this.alertService.error('Saldo insuficiente. Realiza un depósito.');
      return;
    }

    this.apuestaActiva = true;
    const timestamp = new Date().toLocaleTimeString();
    this.chartWrapper.lanzarApuesta(direccion);

    if (!this.isCuentaDemo) {
      this.saldo -= this.montoPorApuesta;
    }

    this.historial.unshift({
      direccion: direccion === 'up' ? '↑' : '↓',
      resultado: '⏳ Esperando...',
      timestamp,
    });
    this.guardarEnLocalStorage();

    const index = 0;

    setTimeout(() => {
      const gano = Math.random() > 0.5;
      this.historial[index].resultado = gano ? 'Ganaste ✅' : 'Perdiste ❌';

      if (!this.isCuentaDemo && gano) {
        this.saldo += this.montoPorApuesta * 2;
      }

      if (gano) {
        this.alertService.mostrarGanar(this.montoPorApuesta * 2);
      } else {
        this.alertService.mostrarPerder();
      }

      this.apuestaActiva = false;
      this.guardarEnLocalStorage();
    }, this.duracion);
  }

  cambiarDuracion(valor: string) {
    this.duracion = parseInt(valor, 10);
  }

  cambiarDuracionDesdeEvento(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    this.cambiarDuracion(value || '30000');
  }

  cambiarTab(tipo: string) {
    this.tipoActivoSeleccionado = tipo;
  }

  abrirDeposito() {
    this.mostrarModal = true;
  }

  cerrarDeposito() {
    this.mostrarModal = false;
  }

  realizarDeposito(monto: number) {
    this.saldo += monto;
    this.isCuentaDemo = false;
    this.mostrarModal = false;
    this.guardarEnLocalStorage();
  }

  guardarEnLocalStorage() {
    localStorage.setItem('historial', JSON.stringify(this.historial));
    localStorage.setItem('saldo', this.saldo.toString());
    localStorage.setItem('isCuentaDemo', this.isCuentaDemo.toString());
  }

  cambiarInstrumento(instrumento: any) {
    this.instrumentoSeleccionado = instrumento;
    this.tipo = instrumento.tipo;
  }
}