import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  estaLogueado(): boolean {
    return localStorage.getItem('token') !== null;
  }

  obtenerSaldo(): string {
    const saldo = localStorage.getItem('saldo');
    return saldo ? parseFloat(saldo).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }) : '$0.00';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
