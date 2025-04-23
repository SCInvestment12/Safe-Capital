import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'Prueba1' && this.password === '1234') {
      localStorage.setItem('rol', 'ADMIN');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Credenciales inválidas');
    }
  }
}
