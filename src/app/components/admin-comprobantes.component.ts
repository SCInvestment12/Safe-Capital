import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-comprobantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-comprobantes.component.html',
  styleUrls: ['./admin-comprobantes.component.css']
})
export class AdminComprobantesComponent implements OnInit {
  comprobantes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarComprobantes();
  }

  cargarComprobantes() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('https://safe-capital-backend.onrender.com/api/comprobantes/pending', { headers })
      .subscribe({
        next: (data) => this.comprobantes = data,
        error: () => alert('Error al cargar comprobantes')
      });
  }

  aprobar(id: number) {
    this.actualizarEstado(id, 'APROBADO');
  }

  rechazar(id: number) {
    this.actualizarEstado(id, 'RECHAZADO');
  }

  actualizarEstado(id: number, estado: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`https://safe-capital-backend.onrender.com/api/comprobantes/${id}/estado?estado=${estado}`, null, { headers })
      .subscribe({
        next: () => {
          alert(`Comprobante ${estado.toLowerCase()}`);
          this.cargarComprobantes();
        },
        error: () => alert('Error al actualizar estado')
      });
  }
}
