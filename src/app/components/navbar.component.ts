import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DepositoModalComponent } from '../components/deposito-modal/deposito-modal.component';
import { RetiroModalComponent } from '../components/retiro-modal/retiro-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, DepositoModalComponent, RetiroModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  mostrarModalDeposito: boolean = false;
  mostrarModalRetiro: boolean = false;

  constructor(private router: Router) {}

  estaLogueado(): boolean {
    return localStorage.getItem('token') !== null;
  }

  obtenerSaldo(): string {
    const saldo = localStorage.getItem('saldo');
    return saldo
      ? parseFloat(saldo).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
      : '$0.00';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  abrirModalDeposito() {
    this.mostrarModalDeposito = true;
  }

  abrirModalRetiro() {
    this.mostrarModalRetiro = true;
  }

  cerrarModales() {
    this.mostrarModalDeposito = false;
    this.mostrarModalRetiro = false;
  }

  get rol(): string {
    return localStorage.getItem('rol') || '';
  }

  get esAdmin(): boolean {
    return this.rol === 'ROLE_ADMIN' || this.rol === 'ROLE_SUPER_ADMIN';
  }

  get esUsuario(): boolean {
    return this.rol === 'ROLE_USER';
  }

  get esModerador(): boolean {
    return this.rol === 'ROLE_MODERATOR';
  }

  get esSuperAdmin(): boolean {
    return this.rol === 'ROLE_SUPER_ADMIN';
  }
}
