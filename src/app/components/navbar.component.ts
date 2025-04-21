import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <a routerLink="/">Inicio</a>
      <ng-container *ngIf="estaLogueado(); else opcionesGuest">
        <a routerLink="/dashboard">Dashboard</a>
        <a (click)="logout()">Cerrar sesión</a>
      </ng-container>
      <ng-template #opcionesGuest>
        <a routerLink="/login">Login</a>
        <a routerLink="/register">Registro</a>
      </ng-template>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      gap: 15px;
      padding: 15px;
      background: #0d6efd;
      color: white;
    }
    a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class NavbarComponent {
  constructor(private router: Router) {}

  estaLogueado(): boolean {
    return localStorage.getItem('rol') !== null;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
