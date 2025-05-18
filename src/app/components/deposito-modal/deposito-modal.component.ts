import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-deposito-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deposito-modal.component.html',
  styleUrls: ['./deposito-modal.component.css']
})
export class DepositoModalComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  metodoSeleccionado: string = '';
  monto: number | null = null;
  clabe: string = 'Cargando...';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8096/api/config/clabe', { responseType: 'text' })
      .subscribe({
        next: (respuesta) => this.clabe = respuesta,
        error: () => this.clabe = 'Error al cargar CLABE'
      });
  }

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
    if (this.monto === null || this.monto <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }

    localStorage.setItem('montoDeposito', this.monto.toString());
    this.cerrarModal();
    this.router.navigate(['/perfil']);
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }
}
