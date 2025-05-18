import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent]
})
export class RegisterPageComponent {
  nombre: string = '';
  apellidos: string = '';
  username: string = '';
  curp: string = '';
  email: string = '';
  telefono: string = '';
  fechaNacimiento: string = '';
  password: string = '';
  confirmar: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  registrarse() {
    if (!this.nombre || !this.apellidos || !this.username || !this.curp || !this.email || !this.telefono || !this.fechaNacimiento || !this.password || !this.confirmar) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.password !== this.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const nuevoUsuario = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      curp: this.curp,
      fechaNacimiento: this.fechaNacimiento,
      telefono: this.telefono,
      correoElectronico: this.email,
      contrasena: this.password // ✅ nombre correcto
    };

    console.log('Usuario que se envía al backend:', nuevoUsuario);

    this.authService.register(nuevoUsuario).subscribe({
      next: () => {
        alert('¡Registro exitoso!');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Hubo un error al registrar. Intenta nuevamente.');
      }
    });
  }
}
