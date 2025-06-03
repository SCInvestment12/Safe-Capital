import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaldoService } from '../../services/saldo.service';

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

    const retiroEnProceso = localStorage.getItem('retiro_en_proceso');
    if (retiroEnProceso) {
      const data = JSON.parse(retiroEnProceso);
      const tiempoPasado = Date.now() - data.timestamp;
      const unaHora = 60 * 60 * 1000;

      if (tiempoPasado < unaHora) {
        this.confirmado = true;
        const restante = unaHora - tiempoPasado;
        this.timeoutId = setTimeout(() => {
          this.restaurarSaldo(data.saldoOriginal);
        }, restante);
      } else {
        this.restaurarSaldo(data.saldoOriginal);
      }
    }
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

  solicitarRetiro() {
    this.confirmado = true;
    this.rechazado = false;

    this.saldoService.obtenerSaldo().subscribe(saldoActual => {
      const nuevoSaldo = saldoActual - this.monto;
      this.saldoService.actualizarSaldo(nuevoSaldo);

      const data = {
        timestamp: Date.now(),
        saldoOriginal: saldoActual
      };
      localStorage.setItem('retiro_en_proceso', JSON.stringify(data));

      this.timeoutId = setTimeout(() => {
        this.restaurarSaldo(saldoActual);
      }, 60 * 60 * 1000); // puedes poner 10 * 1000 para pruebas
    });
  }

  private restaurarSaldo(saldoOriginal: number) {
    this.saldoService.actualizarSaldo(saldoOriginal);
    localStorage.removeItem('retiro_en_proceso');
    this.confirmado = false;
    this.rechazado = true;
  }
}
