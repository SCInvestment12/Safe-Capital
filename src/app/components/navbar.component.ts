import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DepositoModalComponent } from '../components/deposito-modal/deposito-modal.component';
import { RetiroModalComponent } from '../components/retiro-modal/retiro-modal.component';
import { SaldoService } from '../services/saldo.service'; // ✅ importado

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, DepositoModalComponent, RetiroModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  mostrarModalDeposito = false;
  mostrarModalRetiro = false;
  saldoFormateado: string = '$0.00';

  constructor(private router: Router, private saldoService: SaldoService) {}

  ngOnInit(): void {
    if (this.estaLogueado()) {
      this.saldoService.cargarSaldo();
      this.saldoService.obtenerSaldo().subscribe(saldo => {
        this.saldoFormateado = saldo.toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN'
        });
        localStorage.setItem('saldo', saldo.toString()); // Opcional si deseas persistir localmente
      });
    }
  }

  get isRegisterPage(): boolean {
    return this.router.url === '/register';
  }

  estaLogueado(): boolean {
    return localStorage.getItem('token') !== null;
  }

  obtenerSaldo(): string {
    return this.saldoFormateado;
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
