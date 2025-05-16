import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  comprobantes: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerComprobantes();
  }

  obtenerComprobantes() {
    this.loading = true;
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('https://safe-capital-backend.onrender.com/api/comprobantes/pendientes', { headers })
      .subscribe({
        next: data => {
          this.comprobantes = data;
          this.loading = false;
        },
        error: () => {
          alert('Error al cargar comprobantes');
          this.loading = false;
        }
      });
  }

  aprobar(id: number) {
    this.cambiarEstado(id, 'APROBADO');
  }

  rechazar(id: number) {
    this.cambiarEstado(id, 'RECHAZADO');
  }

  cambiarEstado(id: number, estado: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `https://safe-capital-backend.onrender.com/api/comprobantes/${id}/estado?estado=${estado}`;

    this.http.put(url, null, { headers }).subscribe({
      next: () => {
        alert(`Comprobante ${estado.toLowerCase()} correctamente`);
        this.obtenerComprobantes();
      },
      error: () => alert('Error al cambiar estado')
    });
  }
}
