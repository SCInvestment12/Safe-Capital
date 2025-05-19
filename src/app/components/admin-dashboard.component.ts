import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule      // <-- necesario para HttpClient en standalone
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  comprobantes: any[] = [];
  tasaCetes = 0.0;

  // Configuración bancaria
  banco = '';
  bancoNueva = '';
  cuenta = '';
  cuentaNueva = '';
  clabe = '';
  clabeNueva = '';

  loading = false;

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token') || '';
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.cargarComprobantes();
    this.obtenerTasaCetes();
    this.obtenerConfiguracion();
  }

  // Comprobantes
  cargarComprobantes() {
    this.loading = true;
    this.http.get<any[]>(
      'https://safe-capital-backend.onrender.com/api/comprobantes/pending',
      { headers: this.headers }
    ).subscribe({
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

  acreditarSaldo(id: number, correo: string) {
    const montoStr = prompt('Ingresa el monto a acreditar:');
    const monto = montoStr ? parseFloat(montoStr) : NaN;
    if (isNaN(monto)) {
      alert('Monto inválido.');
      return;
    }
    this.http.post(
      'https://safe-capital-backend.onrender.com/api/usuarios/saldo/acreditar',
      { correoElectronico: correo, monto },
      { headers: this.headers }
    ).subscribe({
      next: () => this.cargarComprobantes(),
      error: () => alert('Error al acreditar saldo')
    });
  }

  rechazar(id: number) {
    this.actualizarEstado(id, 'RECHAZADO');
  }

  private actualizarEstado(id: number, estado: string) {
    this.http.put(
      `https://safe-capital-backend.onrender.com/api/comprobantes/${id}/estado?estado=${estado}`,
      null,
      { headers: this.headers }
    ).subscribe({
      next: () => this.cargarComprobantes(),
      error: () => alert('Error al actualizar estado')
    });
  }

  // CETES
  obtenerTasaCetes() {
    this.http.get<number>(
      'https://safe-capital-backend.onrender.com/api/cetes/tasa',
      { headers: this.headers }
    ).subscribe({
      next: tasa => this.tasaCetes = tasa,
      error: () => alert('Error al obtener la tasa de CETES')
    });
  }

  actualizarTasaCetes() {
    this.http.put(
      `https://safe-capital-backend.onrender.com/api/cetes/configurar-tasa?tasa=${this.tasaCetes}`,
      null,
      { headers: this.headers }
    ).subscribe({
      next: () => alert('Tasa de CETES actualizada correctamente.'),
      error: () => alert('Error al actualizar la tasa de CETES')
    });
  }

  // Configuración bancaria
  private obtenerConfiguracion() {
    // Banco
    this.http.get('https://safe-capital-backend.onrender.com/api/config/banco', {
      headers: this.headers,
      responseType: 'text'
    }).subscribe({
      next: v => {
        this.banco = v;
        this.bancoNueva = v;
      },
      error: () => alert('Error al obtener el banco')
    });

    // Cuenta
    this.http.get('https://safe-capital-backend.onrender.com/api/config/cuenta', {
      headers: this.headers,
      responseType: 'text'
    }).subscribe({
      next: v => {
        this.cuenta = v;
        this.cuentaNueva = v;
      },
      error: () => alert('Error al obtener la cuenta')
    });

    // CLABE
    this.http.get('https://safe-capital-backend.onrender.com/api/config/clabe', {
      headers: this.headers,
      responseType: 'text'
    }).subscribe({
      next: v => {
        this.clabe = v;
        this.clabeNueva = v;
      },
      error: () => alert('Error al obtener la CLABE')
    });
  }

  actualizarBanco() {
    this.http.put(
      'https://safe-capital-backend.onrender.com/api/config/banco',
      this.bancoNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        alert('Banco actualizado correctamente');
        this.banco = this.bancoNueva;
      },
      error: () => alert('Error al actualizar el banco')
    });
  }

  actualizarCuenta() {
    this.http.put(
      'https://safe-capital-backend.onrender.com/api/config/cuenta',
      this.cuentaNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        alert('Cuenta actualizada correctamente');
        this.cuenta = this.cuentaNueva;
      },
      error: () => alert('Error al actualizar la cuenta')
    });
  }

  actualizarClabe() {
    this.http.put(
      'https://safe-capital-backend.onrender.com/api/config/clabe',
      this.clabeNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        alert('CLABE actualizada correctamente');
        this.clabe = this.clabeNueva;
      },
      error: () => alert('Error al actualizar la CLABE')
    });
  }
}
