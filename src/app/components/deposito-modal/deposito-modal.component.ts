import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposito-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deposito-modal.component.html',
  styleUrls: ['./deposito-modal.component.css']
})
export class DepositoModalComponent {
  @Output() cerrar = new EventEmitter<void>();
  metodoSeleccionado: string = 'SPEI';

  constructor(private router: Router) {}

  get nombreCompleto(): string {
    const nombre = localStorage.getItem('nombre') || '';
    const apellidos = localStorage.getItem('apellidos') || '';
    return nombre && apellidos ? `${nombre} ${apellidos}` : 'Usuario';
  }

  get referencia(): string {
    const id = localStorage.getItem('id');
    return id ? id : 'N/A';
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  notificarDeposito() {
    this.cerrarModal();
    this.router.navigate(['/perfil']);
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }
}
