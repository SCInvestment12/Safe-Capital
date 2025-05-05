import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
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

  acreditarSaldo(id: number, correo: string) {
    const monto = prompt('Ingresa el monto a acreditar:');
    if (!monto || isNaN(+monto)) {
      alert('Monto inválido.');
      return;
    }

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('https://safe-capital-backend.onrender.com/api/usuarios/saldo/acreditar', {
      correoElectronico: correo,
      monto: parseFloat(monto)
    }, { headers }).subscribe({
      next: () => {
        this.actualizarEstado(id, 'APROBADO');
      },
      error: () => alert('Error al acreditar saldo')
    });
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
