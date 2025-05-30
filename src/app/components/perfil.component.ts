// src/app/modules/profile/perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  // Perfil
  nombre = '';
  apellidos = '';
  correo = '';
  curp = '';
  telefono = '';
  fechaNacimiento = '';
  modoEdicion = false;
  nombreEditado = '';
  apellidosEditado = '';
  telefonoEditado = '';

  // Finanzas
  saldo = 0;
  movimientos: Array<{ tipo: string; monto: number; fecha: string }> = [];
  portafolio: Array<{ instrumento: string; monto: number; fecha: string; tipo: string }> = [];
  mostrarModal = false;
  ultimoDeposito: any;

  // Configuración de depósito
  banco = 'Cargando...';
  cuenta = 'Cargando...';
  clabe = 'Cargando...';

  // Comprobante
  archivoComprobante: File | null = null;

  private headers: HttpHeaders;
  private base = 'https://safe-capital-backend.onrender.com/api';

  constructor(
    private userService: UserService,
    private alert: AlertService,
    private http: HttpClient
  ) {
    const token = localStorage.getItem('token') || '';
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarSaldo();
    this.cargarMovimientosYPortafolio();
    this.cargarDatosBancarios();
  }

  // Perfil
  cargarPerfil() {
    this.userService.obtenerPerfil().subscribe({
      next: data => {
        this.nombre = data.nombre;
        this.apellidos = data.apellidos;
        this.correo = data.correo;
        this.curp = data.curp;
        this.telefono = data.telefono;
        this.fechaNacimiento = data.fechaNacimiento;
      },
      error: () => this.alert.error('Error al cargar perfil')
    });
  }

  editarPerfil() {
    this.modoEdicion = true;
    this.nombreEditado = this.nombre;
    this.apellidosEditado = this.apellidos;
    this.telefonoEditado = this.telefono;
  }

  guardarPerfil() {
    if (!this.nombreEditado || !this.apellidosEditado || !this.telefonoEditado) {
      this.alert.error('Completa todos los campos antes de guardar.');
      return;
    }
    this.userService.actualizarPerfil({
      nombre: this.nombreEditado,
      apellidos: this.apellidosEditado,
      telefono: this.telefonoEditado
    }).subscribe({
      next: () => {
        this.nombre = this.nombreEditado;
        this.apellidos = this.apellidosEditado;
        this.telefono = this.telefonoEditado;
        this.modoEdicion = false;
        this.alert.success('Perfil actualizado correctamente.');
      },
      error: () => this.alert.error('Error al actualizar perfil.')
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
  }

  // Saldo y movimientos
  cargarSaldo() {
    this.userService.obtenerSaldo().subscribe({
      next: s => this.saldo = s,
      error: () => this.alert.error('Error al cargar el saldo')
    });
  }

  cargarMovimientosYPortafolio() {
    // Simula datos; reemplaza con llamadas reales si las tienes
    this.movimientos = [
     
    ];
    this.portafolio = [
      
    ];
    const depositos = this.movimientos.filter(m => m.tipo === 'Depósito');
    this.ultimoDeposito = depositos.length ? depositos[depositos.length - 1] : null;
  }

  // Modal movimientos
  abrirModal() {
    this.mostrarModal = true;
  }
  cerrarModal() {
    this.mostrarModal = false;
  }

  getIconoMovimiento(tipo: string): string {
    switch (tipo) {
      case 'Depósito':  return 'fas fa-arrow-down text-success';
      case 'Retiro':    return 'fas fa-arrow-up text-danger';
      case 'Inversion': return 'fas fa-coins text-warning';
      default:          return 'fas fa-exchange-alt';
    }
  }

  // Datos bancarios
  cargarDatosBancarios() {
    this.http.get(`${this.base}/config/banco`, {
      headers: this.headers, responseType: 'text'
    }).subscribe(v => this.banco = v, () => this.banco = 'Error al cargar banco');

    this.http.get(`${this.base}/config/cuenta`, {
      headers: this.headers, responseType: 'text'
    }).subscribe(v => this.cuenta = v, () => this.cuenta = 'Error al cargar cuenta');

    this.http.get(`${this.base}/config/clabe`, {
      headers: this.headers, responseType: 'text'
    }).subscribe(v => this.clabe = v, () => this.clabe = 'Error al cargar CLABE');
  }

  get nombreCompleto(): string {
    return this.nombre && this.apellidos ? `${this.nombre} ${this.apellidos}` : 'Usuario';
  }

  get referencia(): string {
    return localStorage.getItem('id') || 'N/A';
  }

  // Subir comprobante
  onFileChange(event: any) {
    this.archivoComprobante = event.target.files[0] || null;
  }

  subirComprobante() {
    if (!this.archivoComprobante) {
      this.alert.error('Selecciona un archivo antes de enviar.');
      return;
    }
    const form = new FormData();
    form.append('archivo', this.archivoComprobante);
    this.http.post(`${this.base}/depositos/subir`, form, { headers: this.headers })
      .subscribe(() => this.alert.success('Comprobante enviado correctamente.'),
                 () => this.alert.error('Error al enviar comprobante.'));
  }

  // Navegación
  irAFondos() {
    console.log('Ir a agregar fondos');
  }
  irATrading() {
    console.log('Ir a Trading');
  }
  irADashboard() {
    const rol = localStorage.getItem('rol') || 'ROLE_USER';
    const rutas: Record<string, string> = {
      ROLE_USER: '/dashboard/user',
      ROLE_MODERATOR: '/dashboard/moderator',
      ROLE_ADMIN: '/dashboard/admin',
      ROLE_SUPER_ADMIN: '/dashboard/super-admin'
    };
    window.location.href = rutas[rol];
  }
}
