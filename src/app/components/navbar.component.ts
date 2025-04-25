import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    return localStorage.getItem('rol') !== null;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
  // Método para verificar si estamos en la página de login
  isLoginPage(): boolean {
    return this.router.url === '/login'; // Comprueba si la URL es la de la página de login
  }
}
