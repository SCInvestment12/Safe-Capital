import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgFor, CurrencyPipe } from '@angular/common';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [CommonModule, FormsModule, NgClass, NgFor, CurrencyPipe, RouterModule]
})
export class PerfilComponent {
  montoRetiro: number = 0;
  clabe: string = '';
  saldo: number = 0;
  archivoComprobante: File | null = null;
  modoEdicion = false;

  nombre = '';
  apellidos = '';
  curp = '';
  correo = '';
  telefono = '';
  fechaNacimiento = '';

  nombreEditado = '';
  apellidosEditado = '';
  telefonoEditado = '';

  ultimoDeposito: any;
  ultimoRetiro: any;
  totalApuestas: number = 0;
  mostrarModal = false;

  movimientos = [
    { tipo: 'Depósito', monto: 2000, fecha: '03 abril 2025' },
    { tipo: 'Retiro', monto: 500, fecha: '28 marzo 2025' },
    { tipo: 'Apuesta', monto: 150, fecha: '27 marzo 2025' }
  ];

  portafolio = [
    { instrumento: 'CETES 28D', monto: 3000, fecha: '10 abril 2025', tipo: 'CETES' },
    { instrumento: 'BTC/USD', monto: 1500, fecha: '15 abril 2025', tipo: 'Cripto' },
    { instrumento: 'NASDAQ ETF', monto: 2200, fecha: '20 abril 2025', tipo: 'ETF' }
  ];

  constructor(
    private alert: AlertService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.calcularResumen();
    this.cargarPerfil();
    this.cargarSaldo();
  }

  cargarPerfil() {
    this.userService.obtenerPerfil().subscribe({
      next: (data: any) => {
        this.nombre = data.nombre;
        this.apellidos = data.apellidos;
        this.curp = data.curp;
        this.telefono = data.telefono;
        this.correo = data.correo;
        this.fechaNacimiento = data.fechaNacimiento;
      },
      error: () => {
        this.alert.error('Error al cargar perfil');
      }
    });
  }

  cargarSaldo() {
    this.userService.obtenerSaldo().subscribe({
      next: (saldo) => this.saldo = saldo,
      error: () => this.alert.error('Error al cargar el saldo')
    });
  }

  calcularResumen() {
    const depositos = this.movimientos.filter(m => m.tipo === 'Depósito');
    const retiros = this.movimientos.filter(m => m.tipo === 'Retiro');
    const apuestas = this.movimientos.filter(m => m.tipo === 'Apuesta');

    this.ultimoDeposito = depositos[depositos.length - 1];
    this.ultimoRetiro = retiros[retiros.length - 1];
    this.totalApuestas = apuestas.length;
  }

  async solicitarRetiro() {
    if (!this.montoRetiro || !this.clabe || this.clabe.length !== 18) {
      this.alert.error('Por favor, llena todos los campos correctamente.');
      return;
    }

    const confirmado = await this.alert.confirmacion('¿Deseas solicitar este retiro?');
    if (!confirmado) return;

    this.alert.success('Solicitud de retiro enviada correctamente.');
    this.montoRetiro = 0;
    this.clabe = '';
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

    const payload = {
      nombre: this.nombreEditado,
      apellidos: this.apellidosEditado,
      telefono: this.telefonoEditado
    };

    this.userService.actualizarPerfil(payload).subscribe({
      next: () => {
        this.nombre = this.nombreEditado;
        this.apellidos = this.apellidosEditado;
        this.telefono = this.telefonoEditado;
        this.modoEdicion = false;
        this.alert.success('Perfil actualizado correctamente.');
      },
      error: () => {
        this.alert.error('Error al actualizar perfil.');
      }
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoComprobante = file;
    }
  }

  subirComprobante() {
    if (!this.archivoComprobante) {
      this.alert.error('Selecciona un archivo antes de enviar.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('archivo', this.archivoComprobante);

    fetch('https://safe-capital-backend.onrender.com/api/depositos/subir', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }).then(() => {
      this.alert.success('Comprobante enviado correctamente.');
    }).catch(() => {
      this.alert.error('Error al enviar comprobante.');
    });
  }

  irAFondos() {
    console.log('Ir a agregar fondos');
  }

  irAHistorial() {
    console.log('Ir al historial');
  }

  irATrading() {
    console.log('Ir al módulo de trading');
  }

  getIconoMovimiento(tipo: string): string {
    switch (tipo) {
      case 'Depósito': return 'fas fa-arrow-down text-success';
      case 'Retiro': return 'fas fa-arrow-up text-danger';
      case 'Apuesta': return 'fas fa-coins text-warning';
      default: return 'fas fa-exchange-alt';
    }
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  irADashboard() {
    const rol = localStorage.getItem('rol');
    switch (rol) {
      case 'ROLE_USER':
        window.location.href = '/dashboard/user'; break;
      case 'ROLE_MODERATOR':
        window.location.href = '/dashboard/moderator'; break;
      case 'ROLE_ADMIN':
        window.location.href = '/dashboard/admin'; break;
      case 'ROLE_SUPER_ADMIN':
        window.location.href = '/dashboard/super-admin'; break;
      default:
        window.location.href = '/dashboard/user';
    }
  }
}
