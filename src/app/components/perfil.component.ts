import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgFor, CurrencyPipe } from '@angular/common';
import { AlertService } from '../services/alert.service'; // importa

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [CommonModule, FormsModule, NgClass, NgFor, CurrencyPipe]
})

export class PerfilComponent {
  montoRetiro: number = 0;
  clabe: string = '';
  saldo: number = 0;
  archivoComprobante: File | null = null;
  modoEdicion = false;

  nombre = 'Axel Garcia';
  correo = 'axel.garcia@email.com';
  telefono = '+52 55 1234 5678';

  nombreEditado = '';
  correoEditado = '';
  telefonoEditado = '';

  ultimoDeposito: any;
  ultimoRetiro: any;
  totalApuestas: number = 0;

  movimientos = [
    { tipo: 'Depósito', monto: 2000, fecha: '03 abril 2025' },
    { tipo: 'Retiro', monto: 500, fecha: '28 marzo 2025' },
    { tipo: 'Apuesta', monto: 150, fecha: '27 marzo 2025' }
  ];

  constructor(private alert: AlertService) {} // injecta en constructor

  ngOnInit() {
    this.calcularResumen();
    this.cargarSaldo();
  }

  cargarSaldo() {
    this.saldo = 12500;
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
  
    // Aquí se haría el POST al backend
    this.alert.success('Solicitud de retiro enviada correctamente.');
    this.montoRetiro = 0;
    this.clabe = '';
  }
  

  editarPerfil() {
    this.modoEdicion = true;
    this.nombreEditado = this.nombre;
    this.correoEditado = this.correo;
    this.telefonoEditado = this.telefono;
  }

  guardarPerfil() {
    if (!this.nombreEditado || !this.correoEditado || !this.telefonoEditado) {
      this.alert.error('Completa todos los campos antes de guardar.');
      return;
    }
  
    this.nombre = this.nombreEditado;
    this.correo = this.correoEditado;
    this.telefono = this.telefonoEditado;
    this.modoEdicion = false;
  
    this.alert.success('Perfil actualizado correctamente.');
  }
  

  cancelarEdicion() {
    this.modoEdicion = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoComprobante = file;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  subirComprobante() {
    if (!this.archivoComprobante) {
      this.alert.error('Selecciona un archivo antes de enviar.');
      return;
    }
  
    // Simula subida
    this.alert.success('Comprobante enviado correctamente.');
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
  mostrarModal = false;

  abrirModal() {
    this.mostrarModal = true;
  }
  
  cerrarModal() {
    this.mostrarModal = false;
  }
  

}
