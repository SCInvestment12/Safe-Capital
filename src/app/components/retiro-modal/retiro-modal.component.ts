// retiro-modal.component.ts corregido con lógica de retiro simulado de 1 hora
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
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
    'BANCOPPEL', 'BANREGIO', 'BANORTE', 'BBVA', 'HEY BANCO', 'HSBC',
    'INBURSA', 'KLAR', 'MERCADO PAGO', 'NU MEXICO', 'SANTANDER',
    'SPIN BY OXXO', 'STP', 'OTROS BANCOS'
  ];

  constructor(
    private dashboardService: DashboardService,
    private saldoService: SaldoService
  ) {}

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
      this.cuenta.trim().length === 10
    );
  }

  solicitarRetiro() {
    if (!this.formularioValido()) return;

    const montoRetirar = this.monto;

    // Disminuir saldo inmediatamente
    this.dashboardService.withdraw({ monto: montoRetirar }).subscribe({
      next: () => {
        this.saldoService.cargarSaldo();
        this.confirmado = true;
        this.rechazado = false;

        // Programar devolución después de 1 hora
        this.timeoutId = setTimeout(() => {
          this.simularDevolucion(montoRetirar);
        }, 60 * 60 * 1000);
      },
      error: () => {
        alert('Error al procesar el retiro');
      }
    });
  }

  private simularDevolucion(monto: number) {
    const userId = parseInt(localStorage.getItem('id') || '0', 10);
    if (userId && monto > 0) {
      this.dashboardService.deposit(userId, {
        amount: monto,
        method: 'RETIRO REVERTIDO',
        termDays: 0
      }).subscribe({
        next: () => {
          this.saldoService.cargarSaldo();
          this.confirmado = false;
          this.rechazado = true; // Mostramos rechazo tras 1 hora como cierre del flujo visual
        },
        error: () => {
          alert('Error al devolver saldo');
        }
      });
    }
  }
}
