import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-retiro-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retiro-modal.component.html',
  styleUrls: ['./retiro-modal.component.css']
})
export class RetiroModalComponent {
  @Output() cerrar = new EventEmitter<void>();

  monto: number = 0;
  banco: string = '';
  cuenta: string = '';
  titular: string = '';
  confirmado = false;
  rechazado = false;
  timeoutId: any = null;

  bancos: string[] = ['BBVA', 'Santander', 'Citibanamex', 'Banorte', 'HSBC', 'Scotiabank'];

  cerrarModal() {
    this.cerrar.emit();
  }

  formularioValido(): boolean {
    return (
      this.monto > 0 &&
      this.banco.trim() !== '' &&
      this.cuenta.trim().length === 18 &&
      this.titular.trim().length > 3
    );
  }

  solicitarRetiro() {
    this.confirmado = true;
    this.rechazado = false;

    // Cancelar cualquier timeout previo antes de asignar uno nuevo
    if (this.timeoutId) clearTimeout(this.timeoutId);

    // Configura la simulación de "validación"
    this.timeoutId = setTimeout(() => {
      this.confirmado = false;
      this.rechazado = true;
    }, 60 * 60 * 1000); // 60 minutos
  }
}
