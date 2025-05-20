// src/app/deposito-modal/deposito-modal.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-deposito-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './deposito-modal.component.html',
  styleUrls: ['./deposito-modal.component.css']
})
export class DepositoModalComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();

  // Paso de selección
  metodoSeleccionado: 'SPEI' | 'TARJETA' | '' = '';
  monto: number | null = null;
  pasoComprobante = false;

  // Datos bancarios
  banco = 'Cargando...';
  cuenta = 'Cargando...';
  clabe = 'Cargando...';

  // Base URL de configuración
  private configBase = 'https://safe-capital-backend.onrender.com/api/config';
  private headers: HttpHeaders;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const token = localStorage.getItem('token') || '';
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.http.get(`${this.configBase}/banco`,  { responseType: 'text' })
      .subscribe({ next: v => this.banco = v,  error: () => this.banco = 'Error al cargar banco' });
    this.http.get(`${this.configBase}/cuenta`, { responseType: 'text' })
      .subscribe({ next: v => this.cuenta = v, error: () => this.cuenta = 'Error al cargar cuenta' });
    this.http.get(`${this.configBase}/clabe`,  { responseType: 'text' })
      .subscribe({ next: v => this.clabe = v,  error: () => this.clabe = 'Error al cargar CLABE' });
  }

  // Datos de usuario y referencia
  get nombreCompleto(): string {
    const n = localStorage.getItem('nombre') || '';
    const a = localStorage.getItem('apellidos') || '';
    return n && a ? `${n} ${a}` : 'Usuario';
  }

  get referencia(): string {
    return localStorage.getItem('id') || 'N/A';
  }

  // Cierra modal
  cerrarModal() {
    this.cerrar.emit();
  }

  // Selección de método
  seleccionarMetodo(m: 'SPEI' | 'TARJETA') {
    this.metodoSeleccionado = m;
    this.pasoComprobante = false;
    this.monto = null;
  }

  // Paso 1: validar monto
  confirmarMonto() {
    if (!this.monto || this.monto <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }
    this.pasoComprobante = true;
  }

  // Acción del botón Notificar Deposito
  notificarDeposito() {
    // Guardamos el monto y navegamos a perfil
    if (this.monto !== null) {
      localStorage.setItem('montoDeposito', this.monto.toString());
    }
    this.cerrar.emit();
    this.router.navigate(['/perfil']);
  }
}
