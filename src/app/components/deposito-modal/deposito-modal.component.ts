import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-deposito-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './deposito-modal.component.html',
  styleUrls: ['./deposito-modal.component.css']
})
export class DepositoModalComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();

  metodoSeleccionado: 'SPEI' | 'TARJETA' | '' = '';
  monto: number | null = null;
  pasoComprobante = false;

  // Datos bancarios dinámicos
  banco = 'Cargando...';
  cuenta = 'Cargando...';
  clabe = 'Cargando...';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Carga Banco
    this.http.get('http://localhost:8096/api/config/banco', { responseType: 'text' })
      .subscribe({
        next: v => this.banco = v,
        error: () => this.banco = 'Error al cargar banco'
      });

    // Carga Cuenta
    this.http.get('http://localhost:8096/api/config/cuenta', { responseType: 'text' })
      .subscribe({
        next: v => this.cuenta = v,
        error: () => this.cuenta = 'Error al cargar cuenta'
      });

    // Carga CLABE
    this.http.get('http://localhost:8096/api/config/clabe', { responseType: 'text' })
      .subscribe({
        next: v => this.clabe = v,
        error: () => this.clabe = 'Error al cargar CLABE'
      });
  }

  get nombreCompleto(): string {
    const n = localStorage.getItem('nombre') || '';
    const a = localStorage.getItem('apellidos') || '';
    return n && a ? `${n} ${a}` : 'Usuario';
  }

  get referencia(): string {
    return localStorage.getItem('id') || 'N/A';
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  seleccionarMetodo(m: 'SPEI' | 'TARJETA') {
    this.metodoSeleccionado = m;
    this.pasoComprobante = false;
    this.monto = null;
  }

  confirmarMonto() {
    if (!this.monto || this.monto <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }
    this.pasoComprobante = true;
  }

  notificarDeposito() {
    localStorage.setItem('montoDeposito', this.monto!.toString());
    this.cerrarModal();
    this.router.navigate(['/perfil']);
  }
}
