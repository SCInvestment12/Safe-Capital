import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // <-- AÑADIDO RouterModule
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent] // <-- AÑADIDO RouterModule
})
export class RegisterPageComponent {
  nombre: string = '';
  apellido: string = '';
  username: string = '';
  curp: string = '';
  email: string = '';
  telefono: string = '';     
  direccion: string = '';
  fechaNacimiento: string = ''; 
  password: string = '';
  confirmar: string = '';

  constructor(private router: Router) {}

  registrarse() {
    if (!this.nombre || !this.email || !this.password || !this.confirmar) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.password !== this.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Aquí iría lógica para guardar usuario en backend
    localStorage.setItem('rol', 'USER');
    alert('¡Registro exitoso!');
    this.router.navigate(['/login']);
  }
}
