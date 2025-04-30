// src/app/components/login-page.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  correoElectronico = '';
  password = '';
  error = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login() {
    const loginData = {
      correoElectronico: this.correoElectronico,
      contrasena: this.password
        };

    this.http.post<any>('http://localhost:8096/api/auth/login', loginData).subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('token', token); // ✅ Guardamos el token

        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificamos el payload del JWT
        const rol = payload.rol;

        if (rol) {
          switch (rol) {
            case 'ROLE_USER':
              this.router.navigate(['/dashboard/user']);
              break;
            case 'ROLE_MODERATOR':
              this.router.navigate(['/dashboard/moderator']);
              break;
            case 'ROLE_ADMIN':
              this.router.navigate(['/dashboard/admin']);
              break;
            case 'ROLE_SUPER_ADMIN':
              this.router.navigate(['/dashboard/super-admin']);
              break;
            default:
              this.router.navigate(['/dashboard']);
          }
        } else {
          this.error = 'Rol no encontrado en el token.';
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}
