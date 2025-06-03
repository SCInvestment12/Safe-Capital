import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaldoService } from '../../services/saldo.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-retiro-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retiro-modal.component.html',
  styleUrls: ['./retiro-modal.component.css']
})
export class RetiroModalComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();

  monto: number = 0;
  banco: string = '';
  cuenta: string = '';
  titular: string = '';
  confirmado = false;
  rechazado = false;
  timeoutId: any = null;
  saldoOriginal: number = 0;

  bancos: string[] = [
    'AFIRME', 'AZTECA', 'BANAMEX', 'BANCO DEL BAJÍO', 'BANCO DEL BIENESTAR',
    'BANCOPPEL', 'BANREGIO', 'BANORTE', 'BBVA', 'HEY BANCO', 'HSBC', 'INBURSA',
    'KLAR', 'MERCADO PAGO', 'NU MEXICO', 'SANTANDER', 'SPIN BY OXXO', 'STP', 'OTROS BANCOS'
  ];

  constructor(private saldoService: SaldoService) {}

  ngOnInit() {
    const nombre = localStorage.getItem('nombre') || '';
    const apellidos = localStorage.getItem('apellidos') || '';
    this.titular = `${nombre} ${apellidos}`.trim();

    this.verificarEstadoRetiro();
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  formularioValido(): boolean {
    return (
      this.monto >= 1000 &&
      this.titular.trim().length > 3 &&
      this.banco.trim() !== '' &&
      this.cuenta.trim().length >= 10
    );
  }

  async solicitarRetiro() {
    this.confirmado = true;
    this.rechazado = false;

    try {
      const saldoActual = await firstValueFrom(this.saldoService.obtenerSaldo());
      this.saldoOriginal = saldoActual;

      const nuevoSaldo = saldoActual - this.monto;
      this.saldoService.actualizarSaldo(nuevoSaldo);

      const inicio = new Date().getTime();

      localStorage.setItem('retiro_activo', 'true');
      localStorage.setItem('retiro_inicio', inicio.toString());
      localStorage.setItem('retiro_monto', this.monto.toString());
      localStorage.setItem('retiro_saldo_original', saldoActual.toString());

      this.iniciarCuentaRegresiva(60 * 60 * 1000); // ⏳ 1 hora
    } catch {
      alert('Error al procesar el retiro');
      this.confirmado = false;
    }
  }

  verificarEstadoRetiro() {
    const retiroActivo = localStorage.getItem('retiro_activo');
    const inicioStr = localStorage.getItem('retiro_inicio');
    const montoStr = localStorage.getItem('retiro_monto');
    const saldoOriginalStr = localStorage.getItem('retiro_saldo_original');

    if (retiroActivo === 'true' && inicioStr && montoStr && saldoOriginalStr) {
      const ahora = new Date().getTime();
      const inicio = parseInt(inicioStr);
      const restante = (inicio + 60 * 60 * 1000) - ahora;

      if (restante > 0) {
        this.confirmado = true;
        this.monto = parseFloat(montoStr);
        this.saldoOriginal = parseFloat(saldoOriginalStr);
        this.iniciarCuentaRegresiva(restante);
      } else {
        this.restaurarSaldo();
      }
    }
  }

  iniciarCuentaRegresiva(ms: number) {
    this.timeoutId = setTimeout(() => {
      this.restaurarSaldo();
    }, ms);
  }

  restaurarSaldo() {
    this.saldoService.actualizarSaldo(this.saldoOriginal);

    this.confirmado = false;
    this.rechazado = true;

    localStorage.removeItem('retiro_activo');
    localStorage.removeItem('retiro_inicio');
    localStorage.removeItem('retiro_monto');
    localStorage.removeItem('retiro_saldo_original');
  }
}
