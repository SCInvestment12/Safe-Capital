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

    // ✅ Restar el saldo actual (simulado)
    this.saldoService.obtenerSaldo().subscribe(saldoActual => {
      const nuevoSaldo = saldoActual - this.monto;
      this.saldoService.actualizarSaldo(nuevoSaldo);

      // 🕒 Después de 60 minutos, restaurar el saldo
      this.timeoutId = setTimeout(() => {
        this.saldoService.actualizarSaldo(saldoActual); // restaurar el saldo
        this.confirmado = false;
        this.rechazado = true;
      }, 60 * 60 * 1000);
    });
  }
}
