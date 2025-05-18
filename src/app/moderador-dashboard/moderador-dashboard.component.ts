import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-moderador-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderador-dashboard.component.html',
  styleUrls: ['./moderador-dashboard.component.css']
})
export class ModeradorDashboardComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('https://safe-capital-backend.onrender.com/api/usuarios/todos', { headers })
      .subscribe({
        next: (data) => this.usuarios = data,
        error: () => alert('Error al cargar usuarios')
      });
  }
}
